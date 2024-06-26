"use client";
import React, { useState } from "react";
import { supabase } from "@/app/utils/supabase/supabase";
import { toast } from "react-hot-toast";

export default function New_Event_input() {
  const [eventName, setEventName] = useState("");
  const [eventKey, setEventKey] = useState("");

  const handleNewEvent = async () => {
    try {
      if (!eventName.trim() || !eventKey.trim()) {
        throw new Error("Event name and event key cannot be empty");
      }

      // Check if the event name already exists
      const { data: existingEvents, error: eventError } = await supabase
        .from("Events")
        .select("*")
        .eq("event_name", eventName);

      if (eventError) {
        throw eventError;
      }

      if (existingEvents.length > 0) {
        throw new Error("Event name already exists");
      }

      // Insert new event into the Events table
      const { data, error } = await supabase
        .from("Events")
        .insert({ event_name: eventName, event_key: eventKey });

      if (error) {
        throw error;
      }
      const file = new File(["dummy"], "dummy.jpg", { type: "image/jpeg" });
      const { error: uploadError } = await supabase.storage
        .from("SnapSync Photos")
        .upload(`${eventName}/dummy.jpg`, file);
        

      if (uploadError) {
        throw uploadError;
      }
      const { data: deleteResponse, error: deleteError } = await supabase.storage
      .from("SnapSync Photos")
      .remove([`${eventName}/dummy.jpg`]);

    if (deleteError) {
      throw deleteError;
    }

      setEventName("");
      setEventKey("");
      
      console.log("New event created");
      toast.success("New event created", {
        position: "bottom-right",
        duration: 2000,
      });
      console.log(data);
    } catch (error :any) {
      console.error("Error creating the new event:", error.message);
      toast.error(
        error.message || "Event could not be created, try again",
        {
          duration: 1500,
          position: "bottom-right",
        }
      );
    }
  };

  return (
    <div className="mt-6 flex flex-col">

      <div className="relative mt-2 rounded-md shadow-sm z-50">
        <input
          type="text"
          name="event_name"
          id="event_name"
          className="block w-full z-50 rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>

      <div className="relative mt-2 rounded-md shadow-sm z-50">
        <input
          type="password"
          name="event_key"
          id="event_key"
          className="block w-full z-50 rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Event Key (Passcode)"
          value={eventKey}
          onChange={(e) => setEventKey(e.target.value)}
        />
      </div>

      <div className="place-self-center">
        <button
          className="border mt-10 justify-self-center place-self-center px-4 py-1 rounded-lg  border-gray-500 text-gray-300 z-50"
          onClick={handleNewEvent}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
