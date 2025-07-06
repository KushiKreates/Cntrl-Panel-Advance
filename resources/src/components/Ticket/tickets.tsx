import React, { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import NadhiLoader from "../Loader/Nadhi.dev";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectItem } from "@/components/ui/select";
import Http from "@/lib/Http";
import { toast } from "sonner";
import { IconTrash, IconEye, IconEdit, IconLock, IconCircle, IconReload, IconLinkPlus, IconLink, IconBrowserPlus } from "@tabler/icons-react";

type TicketCategory = {
  id: number;
  name: string;
};

type Ticket = {
  id: number;
  ticket_id: string;
  title: string;
  priority: string;
  message: string;
  status: string;
  created_at: string;
  updated_at?: string;
  ticketcategory: TicketCategory;
};

type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

type ApiResponse = {
  success: boolean;
  data: Ticket[];
  pagination: Pagination;
};

type TicketForm = {
  title: string;
  message: string;
  priority: string;
  ticketcategory_id: number;
};

const fetchTickets = async (page: number): Promise<ApiResponse> => {
  const res = await axios.get<ApiResponse>(`/api/tickets?page=${page}`);
  console.log("Fetched tickets:", res.data);
  return res.data;
};

const fetchCategories = async (): Promise<TicketCategory[]> => {
  const res = await Http.get<{ data: TicketCategory[] }>("/api/tickets/categories");
  return res.data;
};

const createTicket = async (data: TicketForm) => {
  return Http.post("/api/tickets", data);
};

const Tickets: React.FC = () => {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [viewTicket, setViewTicket] = useState<Ticket | null>(null);
  const [editTicket, setEditTicket] = useState<Ticket | null>(null);
  const [form, setForm] = useState<TicketForm>({
    title: "",
    message: "",
    priority: "Normal",
    ticketcategory_id: 0,
  });

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tickets", page],
    queryFn: () => fetchTickets(page),
    keepPreviousData: true,
  });

  const { data: categories } = useQuery({
    queryKey: ["ticket-categories"],
    queryFn: fetchCategories,
  });

  const mutation = useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      setOpen(false);
      setForm({ title: "", message: "", priority: "Normal", ticketcategory_id: 0 });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket created successfully");
    },
    onError: () => {
      toast.error("Failed to create ticket");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };


const handleDelete = async (ticketId: string) => {
  try {
    // Convert ticketId to string if needed for API calls
    const response = await Http.post(`/api/tickets/${ticketId}/delete`);
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success("Ticket deleted successfully");
    } else {
      toast.error(response.message || "Failed to delete ticket");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Failed to delete ticket");
  }
};

  const handleView = (ticketId: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket) {
      setViewTicket(ticket);
    }
  };

  const handleOpen = (ticketId: number) => {
    const ticket = tickets.find(t => t.id === ticketId);
    window.location.href = `/home/tickets/${ticket?.ticket_id}`;

  }

  

  

  const handleClose = async (ticketId: string) => {
  try {
    const response = await Http.post(`/api/tickets/${ticketId}/status`);
    if (response.success) {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      toast.success(response.message || "Ticket status updated");
    } else {
      toast.error(response.message || "Failed to update ticket status");
    }
  } catch (error) {
    toast.error("Failed to update ticket status");
  }
};

  const tickets = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold"></h2>
        <Button onClick={() => setOpen(true)}>Create Ticket</Button>
      </div>

      {/* Create Ticket Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="title"
              placeholder="Ticket Title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <Textarea
              name="message"
              placeholder="Describe your issue..."
              value={form.message}
              onChange={handleChange}
              required
            />
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border text-black rounded-md px-3 py-2 text-sm"
            >
              <option value="Low">Low</option>
              <option value="Normal">Normal</option>
              <option value="High">High</option>
            </select>
            <select
              name="ticketcategory_id"
              value={form.ticketcategory_id}
              onChange={handleChange}
              className="w-full border text-black rounded-md px-3 py-2 text-sm"
              required
            >
              <option className='text-black' value="">Select Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Ticket Modal */}
      <Dialog open={!!viewTicket} onOpenChange={() => setViewTicket(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {viewTicket && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">{viewTicket.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  viewTicket.status === 'open' ? 'bg-green-100 text-green-800' :
                  viewTicket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                  viewTicket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {viewTicket.status}
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span className="font-mono">#{viewTicket.ticket_id}</span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  viewTicket.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                  viewTicket.priority.toLowerCase() === 'normal' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {viewTicket.priority}
                </span>
                <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                <span>{viewTicket.ticketcategory?.name}</span>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-medium ">Message:</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{viewTicket.message}</p>
              </div>
              <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-4">
                <span>Created: {new Date(viewTicket.created_at).toLocaleString()}</span>
                {viewTicket.updated_at && (
                  <span>Updated: {new Date(viewTicket.updated_at).toLocaleString()}</span>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewTicket(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

     
      

      {isLoading ? (
        <NadhiLoader className="justify-center items-center" />
      ) : isError ? (
        <div className="text-center py-8">
          <p className="text-red-600">Error loading tickets. Please try again.</p>
        </div>
      ) : (
        <>
          {tickets.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No tickets found. Create your first ticket!</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <Card key={ticket.id} className="mb-4 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                          ticket.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="font-mono">#{ticket.ticket_id}</span>
                        <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          ticket.priority.toLowerCase() === 'high' ? 'bg-red-100 text-red-800' :
                          ticket.priority.toLowerCase() === 'normal' ? 'bg-orange-100 text-orange-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {ticket.priority}
                        </span>
                        <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
                        <span>{ticket.ticketcategory?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <Button
                        variant="outline"
                        size="sm"
                         onClick={() => handleOpen(ticket.id)}
                        className="flex items-center gap-1"
                      >
                        <IconBrowserPlus className="w-4 h-4" />
                        Open Ticket
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(ticket.id)}
                        className="flex items-center gap-1"
                      >
                        <IconEye className="w-4 h-4" />
                        View
                      </Button>
                    {ticket.status === "Reopened" ? (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClose(ticket.ticket_id)}
                            className="flex items-center gap-1"
                        >
                            <IconLock className="w-4 h-4" />
                            Close
                        </Button>
                        
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleClose(ticket.ticket_id)}
                            className="flex items-center gap-1"
                        >
                             <IconReload className="w-4 h-4" />
                            
                            Reopen
                        </Button>
                    )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(ticket.ticket_id)}
                        className="flex items-center gap-1"
                      >
                        <IconTrash className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-gray-700 mb-3 line-clamp-2">
                    {ticket.message}
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Created: {new Date(ticket.created_at).toLocaleString()}</span>
                    {ticket.updated_at && (
                      <span>Updated: {new Date(ticket.updated_at).toLocaleString()}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {pagination && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page === pagination.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Tickets;