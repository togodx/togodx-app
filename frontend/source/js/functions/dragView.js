let x = 0;
let y = 0;

export function dragView(view) {
  x = view.x;
  y = view.y;

  document.addEventListener('mousemove', elementDrag);
  document.addEventListener('mouseup', closeDrag);

  function elementDrag(e) {
    const dx = e.clientX - x;
    const dy = e.clientY - y;
    console.log('x,y = ' + e.clientX + ',' +  e.clientY);
    console.log('dx, dy =' + dx+ ',' + dy);

    const container = view.container
    container.style.top = `${container.offsetTop + dy}px`;
    container.style.left = `${container.offsetLeft + dx}px`;

    x = e.clientX;
    y = e.clientY;
  }

  function closeDrag() {
    document.removeEventListener('mousemove', elementDrag);
    document.removeEventListener('mouseup', closeDrag);
  }
}
