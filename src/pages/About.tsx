import { Card, CardContent } from "@/components/ui/card";
import { Award, Headphones, Users, Zap } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Zap,
      title: "Innovation",
      description: "Cutting-edge audio technology that pushes boundaries",
    },
    {
      icon: Award,
      title: "Quality",
      description: "Premium materials and rigorous testing standards",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Dedicated support and satisfaction guarantee",
    },
    {
      icon: Headphones,
      title: "Sound Excellence",
      description: "Expertly tuned audio for the perfect listening experience",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">About SoundWave</h1>
        
        <Card className="mb-12 bg-gradient-card border-border">
          <CardContent className="p-8">
            <p className="text-lg text-muted-foreground mb-4">
              SoundWave is a leading innovator in premium audio electronics, dedicated to delivering
              exceptional sound quality and cutting-edge technology to music lovers and tech enthusiasts
              around the world.
            </p>
            <p className="text-lg text-muted-foreground">
              Founded with a passion for perfect sound, we've grown into a trusted brand known for our
              commitment to quality, innovation, and customer satisfaction.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold mb-8 text-center">Our Mission</h2>
        <Card className="mb-12 bg-gradient-card border-border">
          <CardContent className="p-8">
            <p className="text-lg text-center text-muted-foreground">
              To create premium audio products that enhance the way people experience music and sound,
              combining innovative technology with exceptional design and uncompromising quality.
            </p>
          </CardContent>
        </Card>

        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Us</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {values.map((value) => (
            <Card key={value.title} className="bg-gradient-card border-border">
              <CardContent className="p-6">
                <value.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-primary">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-primary-foreground">Join Our Journey</h2>
            <p className="text-lg text-primary-foreground/90">
              Experience the perfect blend of technology and artistry with SoundWave
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
