export interface ServiceGroup {
  name: string;
  services: string[];
}

// Parse service groups from configuration
export const getServiceGroups = (): ServiceGroup[] => {
  return [
    {
      name: "Minecraft Servers",
      services: ["Proxy", "Lobby", "Factions", "SMP", "Test/Builder"]
    },
    {
      name: "Websites", 
      services: ["Website", "Unban-Website"]
    },
    {
      name: "Other Services",
      services: ["MariaDB"]
    }
  ];
};

// Helper to find which group a service belongs to
export const getServiceGroup = (serviceName: string): string | null => {
  if (!serviceName) return null;
  
  const groups = getServiceGroups();
  for (const group of groups) {
    if (group.services.some(s => {
      const serviceNameLower = serviceName.toLowerCase().trim();
      const groupServiceLower = s.toLowerCase().trim();
      
      // Exact match
      if (serviceNameLower === groupServiceLower) return true;
      
      // Partial match - service name contains group service name
      if (serviceNameLower.includes(groupServiceLower)) return true;
      
      // Partial match - group service name contains service name
      if (groupServiceLower.includes(serviceNameLower)) return true;
      
      // Handle common variations
      if (serviceNameLower === 'minecraft proxy' && groupServiceLower === 'proxy') return true;
      if (serviceNameLower === 'web' && groupServiceLower === 'website') return true;
      if (serviceNameLower === 'database' && groupServiceLower === 'mariadb') return true;
      
      return false;
    })) {
      return group.name;
    }
  }
  return null;
};

// Group services by their configured groups
export const groupServices = (services: any[]) => {
  const groups = getServiceGroups();
  const groupedServices: Record<string, any[]> = {};
  const ungroupedServices: any[] = [];

  // Initialize all groups
  groups.forEach(group => {
    groupedServices[group.name] = [];
  });

  // Sort services into groups
  services.forEach(service => {
    const groupName = getServiceGroup(service.name);
    if (groupName && groupedServices[groupName]) {
      groupedServices[groupName].push(service);
    } else {
      ungroupedServices.push(service);
    }
  });

  return { groupedServices, ungroupedServices };
};