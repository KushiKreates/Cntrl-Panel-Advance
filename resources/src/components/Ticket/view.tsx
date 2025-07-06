import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

type TicketCategory = {
  id: number;
  name: string;
};

type User = {
  id: number;
  name: string;
  avatar: string | null;
  email: string;
};

type TicketComment = {
  id: number;
  ticketcomment: string;
  created_at: string;
  user: User;
};

type Ticket = {
  ticket_id: string;
  title: string;
  priority: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
  ticketcategory: TicketCategory;
  ticketcomments: TicketComment[];
};

type TicketViewProps = {
  ticket: Ticket;
};

const TicketView: React.FC<TicketViewProps> = ({ ticket }) => {
  return (
    <Card className="w-full my-8 shadow-lg">
      <CardHeader>
        <CardTitle>
          <span className="text-lg font-semibold">#{ticket.ticket_id}</span> — {ticket.title}
        </CardTitle>
        <div className="flex gap-2 mt-2 flex-wrap">
          <Badge variant="outline">{ticket.ticketcategory.name}</Badge>
          <Badge variant="secondary">{ticket.priority}</Badge>
          <Badge>{ticket.status}</Badge>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Created: {new Date(ticket.created_at).toLocaleString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="font-medium mb-1">Message:</div>
          <div className="bg-muted rounded p-3">{ticket.message}</div>
        </div>
        <Separator className="my-4" />
        <div>
          <div className="font-medium mb-2">Comments</div>
          {ticket.ticketcomments.length === 0 && (
            <div className="text-muted-foreground text-sm">No comments yet.</div>
          )}
          <div className="flex flex-col gap-4">
            {ticket.ticketcomments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {comment.user?.name ? comment.user.name[0]?.toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-semibold">{comment.user?.name || "Unknown User"}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleString()}
                  </div>
                  <div className="mt-1">{comment.ticketcomment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketView;