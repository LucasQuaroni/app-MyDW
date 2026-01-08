import { Fragment } from "react";
import { Bell, X, Calendar, Syringe, Stethoscope, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export interface Reminder {
  id: string;
  title: string;
  description: string;
  date: Date;
  type: "vaccination" | "vet" | "medication" | "other";
  petName: string;
  petId: string;
  completed?: boolean;
}

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: Reminder[];
  onCompleteReminder?: (reminderId: string) => void;
}

const RemindersModal = ({
  isOpen,
  onClose,
  reminders,
  onCompleteReminder,
}: RemindersModalProps) => {
  if (!isOpen) return null;

  const getReminderIcon = (type: Reminder["type"]) => {
    switch (type) {
      case "vaccination":
        return <Syringe className="w-5 h-5 text-blue-500" />;
      case "vet":
        return <Stethoscope className="w-5 h-5 text-green-500" />;
      case "medication":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-purple-500" />;
    }
  };

  const getReminderBadgeColor = (type: Reminder["type"]) => {
    switch (type) {
      case "vaccination":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "vet":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "medication":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default:
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  const getReminderTypeLabel = (type: Reminder["type"]) => {
    switch (type) {
      case "vaccination":
        return "Vacunación";
      case "vet":
        return "Veterinario";
      case "medication":
        return "Medicamento";
      default:
        return "Otro";
    }
  };

  const isOverdue = (date: Date) => {
    return new Date(date) < new Date() && new Date(date).toDateString() !== new Date().toDateString();
  };

  const isToday = (date: Date) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const isUpcoming = (date: Date) => {
    const reminderDate = new Date(date);
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    return reminderDate > today && reminderDate <= nextWeek;
  };

  const sortedReminders = [...reminders].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const pendingReminders = sortedReminders.filter((r) => !r.completed);
  const completedReminders = sortedReminders.filter((r) => r.completed);

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] flex flex-col transform transition-all my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-4 sm:px-6 py-4 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-100">
                  Recordatorios
                </h3>
                <p className="text-xs text-gray-400">
                  {pendingReminders.length} pendiente{pendingReminders.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 text-gray-400 hover:text-gray-100 hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
            {pendingReminders.length === 0 && completedReminders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-sm text-gray-400 text-center">
                  No hay recordatorios pendientes
                </p>
              </div>
            ) : (
              <>
                {/* Pending Reminders */}
                {pendingReminders.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
                      Pendientes
                    </h4>
                    {pendingReminders.map((reminder) => {
                      const overdue = isOverdue(reminder.date);
                      const today = isToday(reminder.date);
                      const upcoming = isUpcoming(reminder.date);

                      return (
                        <Card
                          key={reminder.id}
                          className={`border-gray-700 bg-gray-700/30 ${
                            overdue
                              ? "border-red-500/50 bg-red-500/5"
                              : today
                              ? "border-orange-500/50 bg-orange-500/5"
                              : ""
                          }`}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="mt-0.5">{getReminderIcon(reminder.type)}</div>
                                <div className="flex-1 min-w-0">
                                  <CardTitle className="text-sm font-semibold text-gray-100 mb-1">
                                    {reminder.title}
                                  </CardTitle>
                                  <CardDescription className="text-xs text-gray-400 mb-2">
                                    {reminder.description}
                                  </CardDescription>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className={`text-xs ${getReminderBadgeColor(reminder.type)}`}
                                    >
                                      {getReminderTypeLabel(reminder.type)}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {reminder.petName}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {onCompleteReminder && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => onCompleteReminder(reminder.id)}
                                  className="h-8 w-8 shrink-0 text-gray-400 hover:text-green-400 hover:bg-green-500/10"
                                  title="Marcar como completado"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2 text-xs">
                                <Calendar className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-400">
                                  {new Date(reminder.date).toLocaleDateString("es-ES", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                              {overdue && (
                                <Badge variant="destructive" className="text-xs">
                                  Vencido
                                </Badge>
                              )}
                              {today && !overdue && (
                                <Badge className="bg-orange-500 text-white border-0 text-xs">
                                  Hoy
                                </Badge>
                              )}
                              {upcoming && !today && !overdue && (
                                <Badge
                                  variant="outline"
                                  className="text-xs border-blue-500/50 text-blue-400"
                                >
                                  Próximo
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Completed Reminders */}
                {completedReminders.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
                      Completados
                    </h4>
                    {completedReminders.map((reminder) => (
                      <Card
                        key={reminder.id}
                        className="border-gray-700 bg-gray-700/20 opacity-60"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">{getReminderIcon(reminder.type)}</div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-sm font-semibold text-gray-400 line-through mb-1">
                                {reminder.title}
                              </CardTitle>
                              <CardDescription className="text-xs text-gray-500 mb-2">
                                {reminder.description}
                              </CardDescription>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getReminderBadgeColor(reminder.type)}`}
                                >
                                  {getReminderTypeLabel(reminder.type)}
                                </Badge>
                                <span className="text-xs text-gray-600">
                                  {reminder.petName}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-500">
                              {new Date(reminder.date).toLocaleDateString("es-ES", {
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default RemindersModal;
