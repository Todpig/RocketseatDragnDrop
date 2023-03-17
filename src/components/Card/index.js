import React, { useRef, useContext } from "react";
import { Container, Label } from "./styles";
import { useDrag, useDrop } from "react-dnd";

import Boardcontext from "../Board/context";

export default function Card({ data, index, listIndex }) {
  const ref = useRef();
  const { move } = useContext(Boardcontext);

  const [{ isDragging }, dragRef] = useDrag({
    type: "CARD",
    item: { index, listIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  const [, dropRef] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      const draggedListIndex = item.listIndex;

      const targetListIndex = listIndex;

      const draggedIndex = item.index;
      const targetIndex = index;
      if (
        draggedIndex === targetIndex &&
        draggedListIndex === targetListIndex
      ) {
        return;
      }
      const targetSize = ref.current.getBoundingClientRect();
      const targetCenter = (targetSize.bottom - targetSize.top) / 2;
      const draggedOfSet = monitor.getClientOffset();
      const draggaedTop = draggedOfSet.y - targetSize.top;
      //evita um calculo desnecessario pois nesse caso a movimentação nao vai acontecer pois o card ja esta antes
      if (draggedIndex < targetIndex && draggaedTop < targetCenter) {
        return;
      }
      //evita um calculo desnecessario pois nesse caso a movimentação nao vai acontecer pois o card ja esta depois
      if (draggedIndex > targetIndex && draggaedTop > targetCenter) {
        return;
      }
      move(draggedListIndex, targetListIndex, draggedIndex, targetIndex);
      item.index = targetIndex;
      item.listIndex = targetListIndex;
    },
  });
  dragRef(dropRef(ref));
  return (
    <Container ref={ref} isDragging={isDragging}>
      <header>
        {data.labels.map((label) => (
          <Label key={label} color={label} />
        ))}
      </header>
      <p>{data.content}</p>
      {data.user && <img src={data.user} alt="" />}
    </Container>
  );
}
