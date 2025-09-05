import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { Save, Store, MapPin, Phone, Clock, DollarSign, Upload, FileText, Trash2, Eye } from 'lucide-react';

const BusinessProfile = () => {
  const { user } = useAuth();
  const { businesses, updateBusiness } = useData();
  const { toast } = useToast();
  
  const business = businesses.find(b => b.id === user?.businessId) || businesses[0];
  
  const [profile, setProfile] = useState({
    name: business?.name || '',
    category: business?.category || '',
    phone: business?.phone || '',
    address: business?.address || '',
    deliveryTime: business?.deliveryTime || '',
    deliveryFee: business?.deliveryFee || '',
    image: business?.image || ''
  });

  const [promoFiles, setPromoFiles] = useState(business?.promotions || []);

  const handleSave = () => {
    const updatedData = {
      ...profile,
      deliveryFee: parseFloat(profile.deliveryFee) || 0,
      promotions: promoFiles
    };
    
    updateBusiness(business.id, updatedData);
    toast({
      title: "Perfil actualizado",
      description: "Los datos de tu negocio se han guardado correctamente",
    });
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (promoFiles.length >= 3) {
        toast({
          title: "Límite alcanzado",
          description: "Puedes subir un máximo de 3 archivos.",
          variant: "destructive"
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const newFile = {
          name: file.name,
          url: e.target.result,
          type: file.type
        };
        setPromoFiles([...promoFiles, newFile]);
      };
      reader.readAsDataURL(file);
      toast({
        title: "Archivo listo para guardar",
        description: `${file.name} ha sido añadido. No olvides guardar los cambios.`
      });
    }
  };

  const removeFile = (index) => {
    const newFiles = promoFiles.filter((_, i) => i !== index);
    setPromoFiles(newFiles);
  };


  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Perfil del Negocio</h1>
        <p className="text-white/70 text-lg">Administra la información de tu restaurante</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Store className="w-5 h-5" /> Información del Negocio
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Nombre del restaurante</Label>
                    <Input id="name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-white">Categoría</Label>
                    <Input id="category" value={profile.category} onChange={(e) => setProfile({ ...profile, category: e.target.value })} placeholder="Ej: Comida Rápida, Italiana" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-white">Teléfono</Label>
                    <Input id="phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+52 123 456 7890" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div>
                    <Label htmlFor="deliveryTime" className="text-white">Tiempo de entrega</Label>
                    <Input id="deliveryTime" value={profile.deliveryTime} onChange={(e) => setProfile({ ...profile, deliveryTime: e.target.value })} placeholder="Ej: 25-35 min" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address" className="text-white">Dirección</Label>
                  <Input id="address" value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} placeholder="Dirección completa" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deliveryFee" className="text-white">Costo de envío ($)</Label>
                    <Input id="deliveryFee" type="number" step="0.01" value={profile.deliveryFee} onChange={(e) => setProfile({ ...profile, deliveryFee: e.target.value })} placeholder="0.00" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                  <div>
                    <Label htmlFor="image" className="text-white">URL de imagen de portada</Label>
                    <Input id="image" value={profile.image} onChange={(e) => setProfile({ ...profile, image: e.target.value })} placeholder="https://ejemplo.com/imagen.jpg" className="bg-white/10 border-white/20 text-white placeholder:text-white/50" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass-card border-0">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Menú y Promociones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative border-2 border-dashed border-white/30 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-white/50" />
                  <Label htmlFor="file-upload" className="mt-4 text-sm text-white/70 font-medium">
                    Arrastra y suelta o <span className="text-blue-400 cursor-pointer">busca un archivo</span>
                  </Label>
                  <Input id="file-upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,image/*" onChange={handleFileUpload} />
                  <p className="text-xs text-white/50 mt-1">PDF o Imágenes (JPG, PNG). Máximo 3 archivos.</p>
                </div>
                {promoFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-white/80 font-medium">Archivos cargados:</h4>
                    {promoFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white/10 p-3 rounded-md">
                        <p className="text-white truncate text-sm flex-1 mr-4">{file.name}</p>
                        <div className="flex items-center gap-2">
                           <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-blue-500/50 text-blue-400 hover:bg-blue-500/10" onClick={() => window.open(file.url, '_blank')}><Eye className="h-4 w-4" /></Button>
                           <Button size="sm" variant="outline" className="h-8 w-8 p-0 border-red-500/50 text-red-400 hover:bg-red-500/10" onClick={() => removeFile(index)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
             <Button onClick={handleSave} className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:opacity-90 text-lg py-6">
                <Save className="w-5 h-5 mr-3" />
                Guardar todos los cambios
              </Button>
           </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1 space-y-6">
          <Card className="glass-card border-0">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <img  alt={business?.name} className="w-full h-32 object-cover rounded-lg mb-4" src="https://images.unsplash.com/photo-1694388001616-1176f534d72f" />
                <h3 className="text-xl font-bold text-white mb-2">{business?.name}</h3>
                <p className="text-white/70">{business?.category}</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-white/70"><MapPin className="w-4 h-4" /><span className="text-sm">{business?.address || 'Sin dirección'}</span></div>
                <div className="flex items-center gap-2 text-white/70"><Phone className="w-4 h-4" /><span className="text-sm">{business?.phone || 'Sin teléfono'}</span></div>
                <div className="flex items-center gap-2 text-white/70"><Clock className="w-4 h-4" /><span className="text-sm">{business?.deliveryTime || 'Sin tiempo'}</span></div>
                <div className="flex items-center gap-2 text-white/70"><DollarSign className="w-4 h-4" /><span className="text-sm">${business?.deliveryFee || 0} envío</span></div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0">
            <CardHeader><CardTitle className="text-white text-lg">Estado del Negocio</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/70">Estado</span>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${business?.isOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-white font-medium">{business?.isOpen ? 'Abierto' : 'Cerrado'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/70">Calificación</span>
                <span className="text-white font-bold">⭐ {business?.rating}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10" onClick={() => toast({ title: "🚧 ¡Función no implementada!" })}>
                {business?.isOpen ? 'Cerrar negocio' : 'Abrir negocio'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default BusinessProfile;