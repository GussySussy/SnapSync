"use client";
import React, { useState } from "react";
import Link from "next/link";
import { supabase } from "@/app/utils/supabase/supabase";
import { toast } from "react-hot-toast";


export default function Old_Event_input() {
  const [eventName, setEventName] = useState("");
  const [eventKey, setEventKey] = useState("");

  const handleLogin = async () => {
    try {
      // Check if the event name and key match in the database
      const { data: events, error } = await supabase
        .from("Events")
        .select("*")
        .eq("event_name", eventName)
        .eq("event_key", eventKey);

      if (error) {
        throw error;
      }

      if (events.length === 0) {
        throw new Error("Incorrect event name or event key");
      }

      // If event name and key are correct, navigate to the gallery page
      toast.success("Login successful", {
        position: "bottom-right",
        duration: 1500,
      });

      // Navigate to the gallery page
      window.location.href = "/gallery";
    } catch (error :any) {
      console.error("Error logging in:", error.message);
      toast.error(
        error.message || "Incorrect event name or event key",
        {
          duration: 1500,
          position: "bottom-right",
        }
      );
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center">
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

        <input
          type="password"
          name="event_key"
          id="event_key"
          className="block w-full z-50 mt-10 rounded-md border-0 py-1.5 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Event Key"
          value={eventKey}
          onChange={(e) => setEventKey(e.target.value)}
        />
      </div>

      <div className="place-self-center">
        {/* Trigger handleLogin when the Login button is clicked */}
        <button
          className="border mt-10 justify-self-center place-self-center px-4 py-1 rounded-lg  border-gray-500 text-gray-300 z-50"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
