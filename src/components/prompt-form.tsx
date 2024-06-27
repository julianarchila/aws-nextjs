"use client";

import * as React from "react";
import Textarea from "react-textarea-autosize";

import { useActions, useUIState } from "ai/rsc";

// import { UserMessage } from './stocks/message'
import { UserMessage } from "@/components/message";

import { type AI } from "@/lib/chat/actions";
import { Button } from "@/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";

import { useRouter } from "next/navigation";
import { nanoid } from "@/lib/utils";

interface PromptFormProps {
  input: string;
  setInput: (value: string) => void;
}

export function PromptForm({ input, setInput }: PromptFormProps) {
  const router = useRouter();
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { submitUserMessage } = useActions<typeof AI>();
  const [_, setMessages] = useUIState<typeof AI>();

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      ref={formRef}
      onSubmit={async (e: React.FormEvent) => {
        e.preventDefault();

        // Blur focus on mobile
        /* if (window.innerWidth < 600) {
          e.target?.message.blur();
        } */

        const value = input.trim();
        setInput("");
        if (!value) return;

        // Optimistically add user message UI
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>,
          },
        ]);

        // Submit and get response message
        const responseMessage = await submitUserMessage(value);
        setMessages((currentMessages) => [...currentMessages, responseMessage]);
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button type="submit" size="icon" disabled={input === ""}>
                  <CornerDownLeft />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </form>
  );
}