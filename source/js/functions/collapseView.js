export default function collapseView(elm) {
  const button = elm.querySelector(`.collapsebutton[data-collapse="${elm.dataset.collapse}"]`);
  const content = elm.querySelector(`.collapsingcontent[data-collapse="${elm.dataset.collapse}"]`);
  button.addEventListener('click', () => {
    elm.classList.toggle('-spread');
    button.classList.toggle('-spread');
    content.classList.toggle('-spread');
  });
}
