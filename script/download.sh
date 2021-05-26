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
download_all() {
  echo "Starting download using single thread.."
  IFS=$'\n'
  for line in $(awk -F'\t' 'NR != 1 && NF == 3' ${DATALIST}); do
    local db_name=$(echo "${line}" | cut -f 1 | sed -e 's: :_:g')
    local graph_name=$(echo "${line}" | cut -f 2)
    local url=$(echo "${line}" | cut -f 3)

    if [[ ! -z ${url} ]]; then
      download "${db_name}" "${graph_name}" "${url}"
    fi
  done
}

parallel_download() {
  echo "Starting parallel download using $(nproc) threads.."
  IFS=$'\n'
  for line in $(awk -F'\t' 'NR != 1 && NF == 3' ${DATALIST}); do
    local db_name=$(echo "${line}" | cut -f 1 | sed -e 's: :_:g')
    local graph_name=$(echo "${line}" | cut -f 2)
    local url=$(echo "${line}" | cut -f 3)

    if [[ ! -z ${url} ]]; then
      download "${db_name}" "${graph_name}" "${url}" &
    fi

    [ $( jobs | wc -l ) -ge $( nproc ) ] && wait ||:
  done
  wait
}

download() {
  local db_name="${1}"
  local graph_name="${2}"
  local url="${3}"
  local db_dir=$(create_db_dir ${db_name})
  cd ${db_dir}

  echo ""
  echo "Start Downloading: ${db_name} at ${db_dir}"
  echo "  Graph name: ${graph_name}"

  local cmd=$(generate_wget_command "${url}")
  echo "  Command: ${cmd}"
  eval ${cmd}

  post_download "${graph_name}" "${db_dir}"

}

create_db_dir() {
  local db_name="${1}"
  local db_dir="${DOWNLOAD_DIR}/${db_name}"
  mkdir -p "${db_dir}"
  echo "${db_dir}"
}

generate_wget_command() {
  local url="${1}"
  local opt=""

  if [[ ! -z "${DEBUG}" ]]; then
    local opt="${opt} --spider"
  else
    local opt="${opt} --quiet"
  fi

  if [[ ! -z $(echo ${url} | awk '/\/$/') ]]; then
    local opt="${opt} -m -np -nd --accept '*.nt*','*.ttl*','*.owl*','*.tar*','*.rdf*'"
  fi

  echo "wget ${opt} ${url}"
}

post_download() {
  local graph_name="${1}"
  local db_dir="${2}"

  remove_robotstxt "${db_dir}"
  decompress_files "${db_dir}"
  create_date_triple "${graph_name}" "${db_dir}"
}

remove_robotstxt() {
  local db_dir="${1}"
  cd "${db_dir}" && rm -f "robots.txt"
}

decompress_files() {
  local db_dir="${1}"
  decompress_zipfiles "${db_dir}"
  decompress_tarfiles "${db_dir}"
  decompress_xz "${db_dir}"
  remove_files "${db_dir}"
}

decompress_zipfiles() {
  local db_dir="${1}"
  cd "${db_dir}" && unzip *.zip
}

decompress_tarfiles() {
  local db_dir="${1}"
  cd "${db_dir}" && tar xf *.tar*
}

decompress_xz() {
  local db_dir="${1}"
  cd "${db_dir}" && unxz *.xz*
}

remove_files() {
  local db_dir="${1}"
  cd "${db_dir}" && rm -fr *.zip *.tar* *.xz
}

create_date_triple() {
  local graph_name="${1}"
  local db_dir="${2}"
  local date=$(get_modification_date)
  echo "<${graph_name}> <http://purl.org/dc/terms/date> \"${date}\"^^<http://www.w3.org/2001/XMLSchema#date> ." > "${db_dir}/date.ttl"
}

get_modification_date() {
  local oldest_file_in_the_dir=$(ls -lt | tail -1 | awk '{ print $NF }')
  if [[ ! -z ${oldest_file_in_the_dir} ]]; then
    if [[ ${OSTYPE} =~ ^darwin ]]; then
      local date_epoc=$(stat -f %m "${oldest_file_in_the_dir}" )
      local date=$(date -r "${date_epoc}" '+%Y-%m-%d')
    else
      local date_epoc=$(stat -c '%Y' "${oldest_file_in_the_dir}" )
      local date=$(date --date "@${date_epoc}" '+%Y-%m-%d')
    fi
  else
    local date=$(date '+%Y-%m-%d')
  fi
  echo "${date}"
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
  if [[ ! -z ${NO_PARALLEL} ]]; then
    download_all
  else
    parallel_download
  fi
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
    --no-parallel)
      NO_PARALLEL="true"
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
