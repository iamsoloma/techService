import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { SimpleSelect } from './SimpleSelect';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

export function ComplaintForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    equipment: '',
    location: '',
    priority: '',
    description: '',
    contact: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        equipment: '',
        location: '',
        priority: '',
        description: '',
        contact: '',
      });
    }, 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">Прием жалоб</h2>
        <p className="text-gray-600">
          Заполните форму для регистрации неисправности оборудования
        </p>
      </div>

      {submitted && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Жалоба успешно зарегистрирована. Номер заявки: #{Math.floor(Math.random() * 10000)}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Форма регистрации заявки</CardTitle>
          <CardDescription>
            Укажите детали проблемы с оборудованием
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="equipment">Оборудование</Label>
                <Input
                  id="equipment"
                  placeholder="Например: Насос ЦН-400"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Местоположение</Label>
                <Input
                  id="location"
                  placeholder="Например: Цех №3, участок А"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="priority">Приоритет</Label>
                <SimpleSelect
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  required
                >
                  <option value="">Выберите приоритет</option>
                  <option value="low">Низкий</option>
                  <option value="medium">Средний</option>
                  <option value="high">Высокий</option>
                  <option value="critical">Критический</option>
                </SimpleSelect>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Контактное лицо</Label>
                <Input
                  id="contact"
                  placeholder="ФИО и телефон"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание проблемы</Label>
              <Textarea
                id="description"
                placeholder="Подробно опишите неисправность..."
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <AlertCircle className="w-4 h-4 mr-2" />
                Отправить жалобу
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setFormData({
                    equipment: '',
                    location: '',
                    priority: '',
                    description: '',
                    contact: '',
                  })
                }
              >
                Очистить
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}