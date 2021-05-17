#!/bin/sh
#
# download.sh - download all listed files, require wget
#
# usage:
#  download.sh [--debug] [--outdir <output directory>] <dataList.sh>
#
#
OUTDIR="$(cd $(dirname ${0}) && pwd -P)/../download"

#
# Prep
#
create_download_dir() {
  DOWNLOAD_DIR="${OUTDIR}/$(date +'%Y%m%d')"
  mkdir -p "${DOWNLOAD_DIR}"
}

#
# Download
#
parallel_download() {
  IFS=$'\n'
  for line in $(awk 'NR != 1 && NF == 3' ${DATALIST}); do
    local db_name=$(echo "${line}" | cut -f 1)
    local graph_name=$(echo "${line}" | cut -f 2)
    local url=$(echo "${line}" | cut -f 3)

    download "${db_name}" "${url}" &
    [ $( jobs | wc -l ) -ge $( nproc ) ] && wait ||:
  done
  wait
}

download() {
  local db_name=${1}
  local url=${2}

  create_db_dir ${db_name}
  if [[ ! -z "${DEBUG}" ]]; then
    local opt="--spider -m -np -k -nd"
  else
    local opt="-m -np -k -A nt,ttl,owl -nd"
  fi
  eval wget ${opt} "${url}"
}

create_db_dir() {
  local db_name="${1}"
  local db_dir="${DOWNLOAD_DIR}/${db_name}"
  mkdir -p "${db_dir}"
  cd "${db_dir}"
}

#
# Main
#
main() {
  if [[ ! -e ${DATALIST} ]]; then
    echo "ERROR: No data list found at ${DATALIST}" 1>&2
    exit 1
  fi
  create_download_dir
  parallel_download
}

#
# Parse arguments and run
#
while [[ $# -gt 0 ]]; do
  key=${1}
  case ${key} in
    --debug)
      set -eux
      DEBUG="true"
      ;;
    -O | --outdir)
      OUTDIR="${2}"
      shift
      ;;
    *tsv)
      DATALIST="${1}"
      ;;
  esac
  shift
done

main
