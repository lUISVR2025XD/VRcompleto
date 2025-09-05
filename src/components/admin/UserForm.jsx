import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';

const UserForm = ({ isOpen, setIsOpen, user, userType }) => {
  const { addClient, updateClient, addBusiness, updateBusiness, addDeliveryPerson, updateDeliveryPerson } = useData();
  const { toast } = useToast();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        isActive: user.isActive,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        isActive: true,
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
        if (user) { // Editing existing user
            if (userType === 'Cliente') updateClient(user.id, formData);
            if (userType === 'Negocio') updateBusiness(user.id, formData);
            if (userType === 'Repartidor') updateDeliveryPerson(user.id, formData);
            toast({ title: 'Usuario actualizado', description: 'Los datos del usuario han sido actualizados.' });
        } else { // Creating new user
            if (userType === 'Cliente') addClient(formData);
            if (userType === 'Negocio') addBusiness(formData);
            if (userType === 'Repartidor') addDeliveryPerson(formData);
            toast({ title: 'Usuario creado', description: 'El nuevo usuario ha sido añadido.' });
        }
        setIsOpen(false);
    } catch (error) {
        toast({ title: 'Error', description: 'No se pudo guardar el usuario.', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass-card border-white/20 text-white">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar' : 'Crear'} {userType}</DialogTitle>
          <DialogDescription className="text-white/70">
            {user ? 'Modifica los datos del usuario.' : `Rellena los campos para crear un nuevo ${userType.toLowerCase()}.`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" value={formData.name || ''} onChange={handleChange} placeholder="Nombre completo" required className="bg-white/10 border-white/20 placeholder:text-white/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={formData.email || ''} onChange={handleChange} placeholder="correo@ejemplo.com" required className="bg-white/10 border-white/20 placeholder:text-white/50" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input id="phone" value={formData.phone || ''} onChange={handleChange} placeholder="+1234567890" className="bg-white/10 border-white/20 placeholder:text-white/50" />
          </div>
           <div className="flex items-center space-x-2">
            <Switch id="isActive" checked={formData.isActive} onCheckedChange={handleSwitchChange} />
            <Label htmlFor="isActive">Activo</Label>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="border-white/20 text-white hover:bg-white/10">
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90">
              {user ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;