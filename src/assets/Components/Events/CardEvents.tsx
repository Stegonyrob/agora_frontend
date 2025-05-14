import CardGeneralContainer from "@/assets/Components/Generals/Card/CardGeneralContainer";
import React from "react";
import { IEvent } from "../../../core/events/IEvent";

interface CardEventProps {
  events: IEvent[];
  onSelect: (event: IEvent) => void;
  isPost?: boolean;
}

const CardEvent: React.FC<CardEventProps> = ({ events, onSelect }) => {
  console.log("CardEvent events:", events);
  console.log("CardEvent props:", { events, onSelect });
  return (
    <CardGeneralContainer
      type="event"
      items={events.map(event => ({
        id: event.id,
        title: event.title,
        message: event.message,
        description: typeof event.description === "string" ? event.description : event.description !== undefined && event.description !== null ? String(event.description) : "", // Ensure description is a string
        image: typeof event.image === "string" ? event.image : "", // Ensure image is a string
      }))}
      onSelect={onSelect} session={[]} userId={0} id={0} />
  );
};

export default CardEvent;
