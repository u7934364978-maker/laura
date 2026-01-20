# 🏔️ Guía del Panel de Administración - Wild Fitness

## 📍 Acceso al Panel

**URL Privada:** `https://wild-fitness.com/admin.html`

⚠️ **Importante:** Esta URL NO está enlazada en ninguna parte del sitio web público. Solo Laura (la administradora) conoce esta URL.

---

## 🔐 Credenciales de Acceso

### Credenciales por Defecto
```
Usuario: admin
Contraseña: WildFitness2024!
```

### Duración de Sesión
- **24 horas** desde el último login
- Después de 24 horas, se cierra la sesión automáticamente

---

## 🎯 Funcionalidades del Panel

### 1. 📊 Panel de Resum (Overview)

Muestra estadísticas en tiempo real:

- **Total Activitats**: Número total de actividades creadas
- **Total Participants**: Suma de todas las personas inscritas
- **Pròximes Activitats**: Actividades futuras planificadas
- **Places Disponibles**: Plazas libres en todas las actividades

**Vista Rápida de Pròximes Activitats:**
- Lista de las próximas 5 actividades
- Tipo de actividad
- Fecha y hora
- Ocupación actual

---

### 2. 🗓️ Gestió d'Activitats

#### Crear Nueva Actividad

1. Click en **"➕ Nova Activitat"**
2. Completar el formulario:
   - **Títol**: Nombre de la actividad (ej: "Trail Running al Cadí")
   - **Tipus**: Seleccionar tipo
     - 🏃 Trail Running
     - ⛰️ Trekking
     - 💪 Entrenament
     - 🧘 Yoga
     - 🎯 Workshop
   - **Aforo Màxim**: Número máximo de participantes
   - **Data**: Fecha de la actividad
   - **Hora**: Hora de inicio
   - **Ubicació**: Lugar de encuentro (ej: "Parc Natural Cadí-Moixeró")
   - **Coordenadas** (opcional): Latitud y Longitud para Google Maps
   - **Descripció**: Información adicional

3. Click en **"💾 Guardar Activitat"**

#### Editar Actividad

1. En la tabla de actividades, click en **✏️ (Editar)**
2. Modificar los campos necesarios
3. Guardar cambios

#### Eliminar Actividad

1. En la tabla de actividades, click en **🗑️ (Eliminar)**
2. Confirmar la eliminación

⚠️ **Advertencia:** Al eliminar una actividad, también se eliminan todas las reservas asociadas.

---

### 3. 👥 Gestió de Participants

#### Ver Participantes de una Actividad

1. En la tabla de actividades, click en **👥 (Ver participants)**
2. Se mostrará un modal con:
   - Nombre del participante
   - Email
   - Teléfono (si lo proporcionó)
   - Notas adicionales
   - Fecha y hora de la reserva

#### Ver Todos los Participantes

1. Click en la pestaña **"👥 Participants"**
2. Lista completa de todos los participantes de todas las actividades
3. Muestra:
   - Datos del participante
   - Actividad a la que está inscrito
   - Fecha de la actividad

---

## 📊 Indicadores Visuales

### Barra de Capacidad

El panel muestra una barra visual de ocupación para cada actividad:

- **Verde**: < 70% ocupación
- **Naranja**: 70-89% ocupación
- **Rojo**: ≥ 90% ocupación (casi completa)

### Etiquetas de Tipo

Cada actividad tiene una etiqueta de color según su tipo:
- 🏃 Trail Running (azul)
- ⛰️ Trekking (verde)
- 💪 Entrenament (amarillo)
- 🧘 Yoga (rosa)
- 🎯 Workshop (morado)

---

## 🔄 Sincronización Automática

### Sistema de Sincronización

Cuando guardas una actividad:

1. **Guarda en localStorage** (navegador)
2. **Sincroniza automáticamente** con el servidor Cloudflare
3. **Envía a KV Storage** para recordatorios por email

**Endpoints de sincronización:**
- Producción: `https://wild-fitness.com/api/sync-activities`
- Desarrollo: `http://localhost:8787/api/sync-activities`

---

## 🚪 Cerrar Sesión

Para cerrar sesión de forma segura:

1. Click en **"🚪 Tancar Sessió"** (esquina superior derecha)
2. Se elimina el token de autenticación
3. Redirige al login

---

## 🔒 Seguridad

### Características de Seguridad Implementadas

1. **URL Privada**: No está enlazada públicamente
2. **Autenticación Requerida**: Login obligatorio
3. **Sesiones con Expiración**: 24 horas máximo
4. **Meta Robots**: `noindex, nofollow` (no indexable por Google)
5. **Credenciales Encriptadas**: Base64 encoding en localStorage
6. **Botón Admin Oculto**: Solo visible cuando se accede desde `/admin.html?admin=true`

### Recomendaciones de Seguridad

✅ **Cambiar la contraseña por defecto**
✅ **No compartir la URL con personas no autorizadas**
✅ **Cerrar sesión al terminar**
✅ **No guardar contraseña en navegadores públicos**

---

## 🔧 Cómo Cambiar la Contraseña

### Método 1: Desde la Consola del Navegador

1. Abre el panel de admin: `https://wild-fitness.com/admin.html`
2. Presiona **F12** (abrir DevTools)
3. Ve a la pestaña **Console**
4. Ejecuta este código:

```javascript
// Definir nueva contraseña
const newPassword = 'TuNuevaContraseñaSegura123!';

// Actualizar credenciales
const credentials = {
    username: 'admin',
    password: btoa(newPassword) // Codifica en base64
};

// Guardar en localStorage
localStorage.setItem('wild_fitness_admin_credentials', JSON.stringify(credentials));

console.log('✅ Contraseña actualizada correctamente');

// Recargar página
location.reload();
```

5. Presiona **Enter**
6. La página se recargará automáticamente
7. Usa la nueva contraseña para el próximo login

### Método 2: Crear un Nuevo Usuario Admin

```javascript
// Crear nuevo admin con usuario personalizado
const newAdmin = {
    username: 'laura',
    password: btoa('MiContraseñaSegura2024!')
};

localStorage.setItem('wild_fitness_admin_credentials', JSON.stringify(newAdmin));

console.log('✅ Nuevo admin creado');
console.log('Usuario:', newAdmin.username);

location.reload();
```

---

## 🚨 Troubleshooting

### Problema: No puedo acceder al panel

**Solución:**
1. Verifica que estás usando la URL correcta: `https://wild-fitness.com/admin.html`
2. Asegúrate de usar las credenciales correctas (mayúsculas/minúsculas importan)
3. Limpia la caché del navegador si es necesario

### Problema: La sesión se cierra constantemente

**Causa:** La sesión expira después de 24 horas

**Solución:**
- Vuelve a iniciar sesión
- Asegúrate de cerrar sesión manualmente cuando termines

### Problema: No se sincronizan las actividades

**Causa:** El servidor Cloudflare Worker puede no estar desplegado

**Solución:**
1. Las actividades se guardan localmente en el navegador
2. Verifica que el Worker esté desplegado correctamente
3. Consulta la consola del navegador (F12) para ver errores

### Problema: Olvidé la contraseña

**Solución - Resetear a contraseña por defecto:**

1. Abre la consola del navegador (F12)
2. Ejecuta:

```javascript
// Resetear a contraseña por defecto
localStorage.removeItem('wild_fitness_admin_credentials');

console.log('✅ Credenciales reseteadas');
console.log('Usuario: admin');
console.log('Contraseña: WildFitness2024!');

location.reload();
```

---

## 📱 Responsive Design

El panel de admin está optimizado para:
- **Desktop**: Vista completa con tabla
- **Tablet**: Adaptación de columnas
- **Mobile**: Vista simplificada con scroll horizontal

---

## 📧 Integración con Sistema de Emails

Cuando creas/editas una actividad:

1. Se guarda en localStorage
2. Se sincroniza con Cloudflare KV Storage
3. El **Cron Worker** ejecuta diariamente a las **10:00 AM** (hora de España)
4. Envía recordatorios automáticos **24 horas antes** de cada actividad
5. Los participantes reciben un email con:
   - Detalles de la actividad
   - Ubicación en Google Maps
   - Información de contacto
   - Botón de WhatsApp para Laura

**Documentación completa:** Ver `SCHEDULED_EMAIL_SETUP.md`

---

## 🎓 Flujo de Trabajo Completo

### Crear y Gestionar una Actividad

1. **Login:** Acceder a `https://wild-fitness.com/admin.html`
2. **Crear Actividad:**
   - Click en "Nova Activitat"
   - Completar formulario
   - Guardar
3. **Publicación Automática:**
   - La actividad aparece instantáneamente en `https://wild-fitness.com/calendari.html`
   - Los usuarios pueden verla y reservar
4. **Recibir Inscripciones:**
   - Los usuarios completan el formulario de reserva
   - Se envía email de confirmación automático
   - Se actualiza el contador de inscritos
5. **Monitorear:**
   - Ver estadísticas en tiempo real
   - Consultar lista de participantes
   - Recibir notificaciones por email
6. **Recordatorios Automáticos:**
   - 24 horas antes: email automático a todos los participantes
   - Laura recibe un resumen con estadísticas

---

## 🌟 Características Destacadas

### Ventajas del Sistema

✅ **100% Gratuito**: Sin costes mensuales
✅ **Sincronización Automática**: Cloudflare KV Storage
✅ **Emails Automáticos**: Recordatorios sin intervención manual
✅ **Gestión Completa**: Crear, editar, eliminar actividades
✅ **Estadísticas en Tiempo Real**: Métricas actualizadas
✅ **Seguro**: Acceso restringido y protegido
✅ **Responsive**: Funciona en todos los dispositivos
✅ **Sin Instalación**: Solo necesitas un navegador

---

## 📚 Documentación Relacionada

- **Setup de Emails:** `EMAIL_SETUP.md`
- **Emails Programados:** `SCHEDULED_EMAIL_SETUP.md`
- **DNS Configuration:** `DNS_SETUP_GUIDE.md`
- **Comandos de Deployment:** `DEPLOYMENT_COMMANDS.md`
- **Guía de KV ID:** `KV_ID_GUIDE.md`

---

## 🆘 Soporte

Si tienes problemas técnicos o necesitas ayuda:

1. Revisa la sección **Troubleshooting** de esta guía
2. Consulta la consola del navegador (F12) para errores
3. Verifica que el Worker esté desplegado correctamente
4. Revisa los logs en Cloudflare Dashboard

---

## 📝 Notas Finales

### Datos Almacenados

Los datos se guardan en:
1. **localStorage del navegador** (copia local)
2. **Cloudflare KV Storage** (sincronización)

### Backup Manual

Para hacer un backup de las actividades:

```javascript
// En la consola del navegador (F12)
const activities = JSON.parse(localStorage.getItem('wild_fitness_activities') || '[]');
console.log(JSON.stringify(activities, null, 2));

// Copiar el resultado y guardarlo en un archivo .json
```

### Restaurar Backup

```javascript
// Pegar tu backup aquí
const backup = [
  // ... tu backup en formato JSON
];

localStorage.setItem('wild_fitness_activities', JSON.stringify(backup));
location.reload();
```

---

**¡Listo para gestionar las actividades de Wild Fitness! 🏔️**

Si necesitas ayuda adicional, contacta con el equipo de soporte técnico.

*Última actualización: 20 Enero 2026*
