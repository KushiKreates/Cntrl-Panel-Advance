//This solution lets you specify Lucide icons by using a prefix of `"lu"` (for example, `"luAlarmClock"` to reference the `AlarmClock` icon in lucide-react) while maintaining your previous mapping for FontAwesome icons.// filepath: /Users/Shared/Dev/26-new/Cntrl-Panel-Advance/resources/src/components/Links/links.tsx
import React, { useEffect, useState } from "react";
import Http from "@/lib/Http";
// Import shadcn UI card components (adjust the import path if necessary)
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// Import Lucide icons
import * as LucideIcons from "lucide-react";
import { Package, Database } from "lucide-react";
import { SiPterodactyl } from "react-icons/si";

// Define the shape of a useful link
interface LinkData {
  id: number;
  icon: string;
  title: string;
  link: string;
  description: string;
  position: string;
  created_at: string;
  updated_at: string;
}

// Predefined mapping for some FontAwesome classes
const iconMap: { [key: string]: React.ReactNode } = {
  "fas fa-egg": <Package className="h-5 w-5" />,
  "fas fa-database": <Database className="h-5 w-5" />,
  //@ts-ignore
  "fas fa-pterodactyl": <SiPterodactyl className="h-5 w-5" />,
};


const getIcon = (iconClass: string): React.ReactNode => {
  const lowered = iconClass.toLowerCase().trim();

  // Detect "lu" prefix (with or without following space)
  if (lowered.startsWith("lu")) {
    // Remove the prefix ("lu" or "lu ")
    let raw = lowered.slice(2).trim();
    // Convert kebab-case to PascalCase: "database-zap" -> ["database","zap"] -> ["Database","Zap"] -> "DatabaseZap"
    const pascalName = raw
      .split(/[-\s]+/)          // split on dash or space
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");

    // Look up in LucideIcons
    const IconComponent = (LucideIcons as any)[pascalName];
    if (IconComponent) {
      return <IconComponent className="h-5 w-5" />;
    }
  }

  // Otherwise fall back to FontAwesome map
  return iconMap[iconClass] || <Package className="h-5 w-5" />;
};

const Links: React.FC = () => {
  const [links, setLinks] = useState<LinkData[]>([]);

  useEffect(() => {
    Http.get("/api/links")
      .then((response) => {
        if (response.success) {
          setLinks(response.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching links: ", err);
      });
  }, []);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {links.map((link) => {
        // Try getting a Lucide icon if the icon string starts with "lu"
        const lucideIcon = getIcon(link.icon);
        const renderedIcon =
          lucideIcon || iconMap[link.icon] || <Package className="h-5 w-5" />;
        return (
          <Card key={link.id}>
            <CardHeader className="flex items-center space-x-2">
              <div>{renderedIcon}</div>
              <CardTitle>{link.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p dangerouslySetInnerHTML={{ __html: link.description }} />
              <a
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline mt-2 block"
              >
                Visit Link
              </a>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Links;