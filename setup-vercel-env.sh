#!/bin/bash

# ============================================
# 🔧 Configurar Variables de Entorno en Vercel
# ============================================
# Script para configurar las credenciales en Vercel
# ============================================

echo "🚀 Configurando variables de entorno en Vercel..."
echo ""

# Verificar que Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado"
    echo "📦 Instala con: npm install -g vercel"
    exit 1
fi

echo "✅ Vercel CLI detectado"
echo ""

# Verificar que estamos logueados
echo "🔐 Verificando autenticación..."
vercel whoami

if [ $? -ne 0 ]; then
    echo "❌ No estás autenticado en Vercel"
    echo "🔑 Ejecuta: vercel login"
    exit 1
fi

echo ""
echo "📋 Configurando variables de entorno..."
echo ""

# ============================================
# Configurar SUPABASE_URL
# ============================================
echo "1️⃣ Configurando SUPABASE_URL..."
echo "re_e7qMUJFF_2WiKZuWd9Z28QSoK8SZbR55y" | vercel env add SUPABASE_URL production

# ============================================
# Configurar SUPABASE_ANON_KEY
# ============================================
echo ""
echo "2️⃣ Configurando SUPABASE_ANON_KEY..."
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6bGhjemxxenZ4amNubW9uamFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTUyMDgsImV4cCI6MjA4NDk5MTIwOH0.EZGjY4AOGtpHTnVejY0P6ziTc6crttZ2UhOpxzBaDHI" | vercel env add SUPABASE_ANON_KEY production

# ============================================
# Configurar RESEND_API_KEY
# ============================================
echo ""
echo "3️⃣ Configurando RESEND_API_KEY..."
echo "re_e7qMUJFF_2WiKZuWd9Z28QSoK8SZbR55y" | vercel env add RESEND_API_KEY production

echo ""
echo "✅ Variables configuradas!"
echo ""
echo "📋 Resumen de variables:"
echo "  - SUPABASE_URL: https://yzlhczlqzvxjcnmonjaj.supabase.co"
echo "  - SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (configurada)"
echo "  - RESEND_API_KEY: re_e7qMUJFF_2WiKZuWd9Z28QSoK8SZbR55y"
echo ""
echo "🚀 Próximo paso: Redesplegar"
echo "   vercel --prod"
echo ""
