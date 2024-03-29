"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SetStateAction, useState } from "react";
import React from "react";
import { Label } from "@/components/ui/label";

import { useMutation } from "@tanstack/react-query";
import { calculateTimes } from "./actions";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Confetti from "react-confetti";

type TimeOptions = "Morning" | "Noon" | "Afternoon" | "Evening" | "Night";

interface InitalProps {
  iEmails: string[];
  iEventLength: string;
  iStartDate: Date | undefined;
  iEndDate: Date | undefined;
  iTimeRange: TimeOptions;
  iTitle: string;
}

export function NewEventForm({
  iEmails,
  iEventLength,
  iEndDate,
  iStartDate,
  iTitle,
  iTimeRange,
}: InitalProps) {
  const timeOptions = ["Morning", "Noon", "Afternoon", "Evening", "Night"];
  const userEmail = useSession().data?.user?.email;

  const mutation = useMutation({
    mutationFn: () => {
      return calculateTimes({
        emails,
        eventLength: Number(eventLength),
        startDate: startDate ?? new Date(),
        endDate: endDate ?? new Date(),
        timeRange,
        title,
      });
    },
    onSuccess: (data) => {
      console.log("Success", data);

      setTitle("");
      setEventLength("");
      setStartDate(undefined);
      setEndDate(undefined);
      setTimeRange("Morning");
      setEmails([]);
      setInput("");
      setError(null);
    },
  });

  const [title, setTitle] = useState(iTitle || "");
  const [eventLength, setEventLength] = useState(iEventLength || "");
  const [startDate, setStartDate] = React.useState<undefined | Date>(
    iStartDate,
  );
  const [endDate, setEndDate] = React.useState<undefined | Date>(iEndDate);
  const [timeRange, setTimeRange] = useState<TimeOptions>(iTimeRange);
  const [emails, setEmails] = useState<string[]>(iEmails || []);
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Set user email as default email
  if (userEmail && !emails.includes(userEmail)) {
    setEmails([...emails, userEmail]);
  }
  function onSubmit() {
    if (
      !title ||
      !eventLength ||
      !startDate ||
      !endDate ||
      !timeRange ||
      emails.length === 0
    ) {
      setError("Please fill in all fields");
      return;
    }

    if (startDate > endDate) {
      setError("Start date cannot be after end date");
      return;
    }

    if (Number.isNaN(Number(eventLength))) {
      setError("Event length must be a number");
      return;
    }

    mutation.mutate();

    // Perform submit logic here
    console.log("Form submitted");
    console.log("Title:", title);
    console.log("Event Length:", eventLength);
    console.log("Start Date:", startDate);
    console.log("End Date:", endDate);
    console.log("Time Range:", timeRange);
    console.log("Emails:", emails);
  }

  function addEmail() {
    if (!input) return;
    if (emails.includes(input)) {
      setError("Email already added");
      return;
    }
    setEmails([...emails, input]);
    setInput("");
    setError(null);
  }

  if (mutation.isPending) {
    return (
      <div className="pt-4 flex w-full gap-4 justify-center">
        <div
          className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <p className="">Preparing your perfect plans...</p>
      </div>
    );
  }

  if (mutation.isSuccess) {
    const errors = !(
      typeof mutation.data === "string" && mutation.data.startsWith("?")
    );

    if (errors) {
      return (
        <div className="pt-4 flex w-full gap-4 justify-center">
          <div className="flex flex-col gap-2 text-center">
            <p>
              Almost there, but some people need to make an account first. Check
              back later!
            </p>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="pt-4 flex w-full gap-4 justify-center">
        <div className="flex flex-col gap-2 text-center">
          <p>Plans perfectly provided!</p>
          <Link href={`/results${mutation.data}`}>
            <Button>View Results</Button>
          </Link>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <Label htmlFor="title" className="text-base">
          Title
        </Label>
        <Input
          type="text"
          id="title"
          placeholder="Enter the title of your event"
          className="text-base sm:text-sm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="eventLength">Length</Label>
        <Input
          type="int"
          id="eventLength"
          className="text-base sm:text-sm"
          placeholder="Enter the expected length of event in minutes"
          value={eventLength}
          onChange={(e) => setEventLength(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <Label htmlFor="startDate" className="pb-1">
          Start Date
        </Label>
        <Popover>
          <PopoverTrigger asChild id="startDate">
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal sm:text-sm text-base",
                !startDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col">
        <Label htmlFor="endDate" className="pb-1">
          End Date
        </Label>
        <Popover>
          <PopoverTrigger asChild id="endDate">
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal text-base sm:text-sm",
                !endDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div>
        <Label htmlFor="timeRange">Time Range</Label>
        <Select
          value={timeRange}
          onValueChange={
            setTimeRange as (
              value: SetStateAction<TimeOptions> | string,
            ) => void
          }
        >
          <SelectTrigger className="w-full" id="timeRange">
            <SelectValue
              placeholder="Pick a Time Range"
              className="text-base sm:text-sm"
            />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((option) => (
              <SelectItem
                key={option}
                value={option}
                className="text-base sm:text-sm"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="email">Invitees</Label>
        <div>
          <div className="flex gap-2">
            <Input
              type="email"
              id="email"
              placeholder="Email"
              className="text-base sm:text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addEmail();
                }
              }}
            />
            <Button
              onClick={(e: any) => addEmail()}
              variant="outline"
              size="icon"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </Button>
          </div>
          {emails.map((email) => (
            <div
              key={email}
              className="flex items-center w-full gap-2 justify-between"
            >
              <span>{email}</span>
              <Button
                variant="outline"
                size="icon"
                className="w-8"
                onClick={() => setEmails(emails.filter((e) => e !== email))}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button onClick={onSubmit} className="w-full text-base sm:text-sm">
        Submit
      </Button>
    </div>
  );
}

export default NewEventForm;
