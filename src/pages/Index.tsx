
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Trophy, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Club de Ajedrez</span>
                  <span className="block text-blue-600">Metropolitano</span>
                </h1>
                <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Únete a nuestra comunidad de ajedrecistas. Juega, aprende y compite con socios de todos los niveles en un ambiente amigable y competitivo.
                </p>
                <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div className="rounded-md shadow">
                    <Link to="/play">
                      <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                        <Crown className="mr-2 h-5 w-5" />
                        Jugar Ahora
                      </Button>
                    </Link>
                  </div>
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <Button variant="outline" size="lg" className="w-full text-lg px-8 py-4">
                      Explorar Club
                    </Button>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Características</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Todo lo que necesitas para jugar ajedrez
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Nuestra plataforma ofrece herramientas modernas para mejorar tu experiencia de juego y conectarte con otros ajedrecistas.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <Trophy className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-medium text-gray-900">
                    Partidas Competitivas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-500">
                    Juega partidas clasificatorias con controles de tiempo variados. Sistema de ELO integrado para seguir tu progreso.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <Users className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-medium text-gray-900">
                    Comunidad Activa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-500">
                    Conecta con ajedrecistas de todos los niveles. Participa en torneos, análisis de partidas y sesiones de estudio.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="flex justify-center">
                    <Clock className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-medium text-gray-900">
                    Controles Flexibles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-500">
                    Desde partidas bullet de 1 minuto hasta clásicas de 30 minutos. Encuentra el ritmo perfecto para tu estilo de juego.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">¿Listo para tu próxima partida?</span>
            <span className="block">Comienza a jugar hoy mismo.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-blue-200">
            Únete a cientos de socios que ya disfrutan de la mejor experiencia de ajedrez online.
          </p>
          <Link to="/play">
            <Button 
              size="lg" 
              className="mt-8 bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Crown className="mr-2 h-5 w-5" />
              Ir al Lobby de Juego
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
