import { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { SimpleSelect } from './SimpleSelect';
import { Textarea } from './ui/textarea';
import { CalendarDays, Plus, Users } from 'lucide-react';

interface MaintenanceEvent {
  id: number;
  date: Date;
  equipment: string;
  type: string;
  crew: string;
  priority: 'low' | 'medium' | 'high';
  description: string;
}

const mockEvents: MaintenanceEvent[] = [
  {
    id: 1,
    date: new Date(2025, 10, 25),
    equipment: 'Насос ЦН-400',
    type: 'Плановое ТО',
    crew: 'Бригада №1',
    priority: 'medium',
    description: 'Замена масла и проверка уплотнений',
  },
  {
    id: 2,
    date: new Date(2025, 10, 22),
    equipment: 'Вентилятор ВР-280',
    type: 'Аварийный ремонт',
    crew: 'Бригада №2',
    priority: 'high',
    description: 'Замена поврежденных лопастей',
  },
  {
    id: 3,
    date: new Date(2025, 10, 27),
    equipment: 'Компрессор КВ-500',
    type: 'Диагностика',
    crew: 'Бригада №1',
    priority: 'low',
    description: 'Плановая диагностика системы',
  },
  {
    id: 4,
    date: new Date(2025, 10, 28),
    equipment: 'Электродвигатель АИР-315',
    type: 'Плановое ТО',
    crew: 'Бригада №3',
    priority: 'medium',
    description: 'Проверка изоляции обмоток',
  },
];

const crews = ['Бригада №1', 'Бригада №2', 'Бригада №3', 'Бригада №4'];

export function MaintenancePlanning() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<MaintenanceEvent[]>(mockEvents);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    equipment: '',
    type: '',
    crew: '',
    priority: 'medium' as const,
    description: '',
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  const hasEventsOnDate = (date: Date) => {
    return events.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const handleAddEvent = () => {
    if (!selectedDate) return;

    const event: MaintenanceEvent = {
      id: Math.max(...events.map((e) => e.id)) + 1,
      date: selectedDate,
      ...newEvent,
    };
    setEvents([...events, event]);
    setIsAddDialogOpen(false);
    setNewEvent({
      equipment: '',
      type: '',
      crew: '',
      priority: 'medium',
      description: '',
    });
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive', label: string }> = {
      low: { variant: 'secondary', label: 'Низкий' },
      medium: { variant: 'default', label: 'Средний' },
      high: { variant: 'destructive', label: 'Высокий' },
    };
    const config = variants[priority] || variants.medium;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Планирование технического обслуживания</h2>
        <p className="text-gray-600">Календарь работ и назначение бригад</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Календарь
              </CardTitle>
              <CardDescription>Выберите дату для просмотра запланированных работ</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasEvents: (date) => hasEventsOnDate(date),
                }}
                modifiersClassNames={{
                  hasEvents: 'bg-blue-100 font-bold',
                }}
              />
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  Даты с запланированными работами выделены синим ветом
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events and Crew Assignment Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Events for Selected Date */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    Запланированные работы на{' '}
                    {selectedDate
                      ? selectedDate.toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'выбранную дату'}
                  </CardTitle>
                  <CardDescription>Всего работ: {selectedDateEvents.length}</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить работу
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Планирование работы</DialogTitle>
                      <DialogDescription>
                        Назначение работы на{' '}
                        {selectedDate
                          ? selectedDate.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })
                          : 'выбранную дату'}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="event-equipment">Оборудование</Label>
                          <Input
                            id="event-equipment"
                            placeholder="Название оборудования"
                            value={newEvent.equipment}
                            onChange={(e) => setNewEvent({ ...newEvent, equipment: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-type">Вид ТО</Label>
                          <Input
                            id="event-type"
                            placeholder="Например: Плановое ТО"
                            value={newEvent.type}
                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="event-crew">Назначить бригаду</Label>
                          <SimpleSelect
                            id="event-crew"
                            value={newEvent.crew}
                            onChange={(e) => setNewEvent({ ...newEvent, crew: e.target.value })}
                          >
                            <option value="">Выберите бригаду</option>
                            {crews.map((crew) => (
                              <option key={crew} value={crew}>
                                {crew}
                              </option>
                            ))}
                          </SimpleSelect>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="event-priority">Приоритет</Label>
                          <SimpleSelect
                            id="event-priority"
                            value={newEvent.priority}
                            onChange={(e) => setNewEvent({ ...newEvent, priority: e.target.value as any })}
                          >
                            <option value="low">Низкий</option>
                            <option value="medium">Средний</option>
                            <option value="high">Высокий</option>
                          </SimpleSelect>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event-description">Описание работ</Label>
                        <Textarea
                          id="event-description"
                          placeholder="Детальное описание работ..."
                          rows={4}
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                          Отмена
                        </Button>
                        <Button onClick={handleAddEvent}>Запланировать</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {selectedDateEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">На эту дату работы не запланированы</p>
                  <Button variant="outline" className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Добавить работу
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-gray-900 mb-1">{event.equipment}</h3>
                            <p className="text-sm text-gray-600">{event.type}</p>
                          </div>
                          {getPriorityBadge(event.priority)}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <Label className="text-xs">Бригада</Label>
                            <div className="flex items-center gap-2 mt-1">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-900">{event.crew}</span>
                            </div>
                          </div>
                          <div>
                            <Label className="text-xs">Приоритет</Label>
                            <div className="mt-1">{getPriorityBadge(event.priority)}</div>
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs">Описание</Label>
                          <p className="text-sm text-gray-700 mt-1">{event.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Crew Assignment Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Загрузка бригад
              </CardTitle>
              <CardDescription>Распределение работ по бригадам на выбранную дату</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crews.map((crew) => {
                  const crewEvents = selectedDateEvents.filter((event) => event.crew === crew);
                  return (
                    <div key={crew} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-900">{crew}</p>
                          <p className="text-sm text-gray-600">
                            {crewEvents.length} {crewEvents.length === 1 ? 'работа' : 'работ'}
                          </p>
                        </div>
                      </div>
                      <div>
                        {crewEvents.length === 0 && <Badge variant="secondary">Свободна</Badge>}
                        {crewEvents.length > 0 && crewEvents.length <= 2 && (
                          <Badge variant="default">Загружена</Badge>
                        )}
                        {crewEvents.length > 2 && <Badge variant="destructive">Перегружена</Badge>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}