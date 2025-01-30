import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface DragDropItem {
  id: string;
  text: string;
}

interface DragDropQuestionProps {
  items: DragDropItem[];
  onChange: (order: string[]) => void;
  disabled?: boolean;
}

export const DragDropQuestion: React.FC<DragDropQuestionProps> = ({
  items: initialItems,
  onChange,
  disabled = false,
}) => {
  const [items, setItems] = useState(initialItems);

  const handleDragEnd = (result: any) => {
    if (!result.destination || disabled) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
    onChange(newItems.map(item => item.id));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {items.map((item, index) => (
              <Draggable 
                key={item.id} 
                draggableId={item.id} 
                index={index}
                isDragDisabled={disabled}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-4 bg-white border border-gray-200 rounded-lg transition-all ${
                      snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                    } ${
                      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md cursor-move'
                    }`}
                  >
                    {item.text}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};