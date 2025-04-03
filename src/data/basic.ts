import type { Category } from '../types';

export const basicCategories: Category[] = [
  {
    name: "IDENTIFY",
    description: "Develop organizational understanding to manage cybersecurity risks to systems, assets, data, and capabilities",
    controls: [
      // Asset Management
      {
        id: "ID.AM-1",
        title: "Physical devices and systems within the organization are inventoried",
        description: "Maintain a current inventory of all physical devices and systems within the organization",
        cyfunLevel: "basic",
        guidance: [
          "Create and maintain an inventory of all organizational assets",
          "Include all devices that could connect to networks",
          "Update inventory regularly"
        ],
        references: [
          { name: "CSA CCM", clause: "AIS-01" },
          { name: "ISO 27001", clause: "A.8.1.1" }
        ],
        isKeyMeasure: true
      },
      {
        id: "ID.AM-2",
        title: "Software platforms and applications within the organization are inventoried",
        description: "Maintain a current inventory of software platforms and applications",
        cyfunLevel: "basic",
        guidance: [
          "Document all authorized software",
          "Include version information",
          "Track software licenses"
        ],
        references: [
          { name: "CSA CCM", clause: "AIS-02" },
          { name: "ISO 27001", clause: "A.8.1.1" }
        ]
      },
      {
        id: "ID.AM-3",
        title: "Organizational communication and data flows are mapped",
        description: "Map communication and data flows within the organization",
        cyfunLevel: "basic",
        guidance: [
          "Document data flow diagrams",
          "Identify critical communication paths",
          "Update maps when changes occur"
        ],
        references: [
          { name: "CSA CCM", clause: "DSI-02" }
        ]
      },
      {
        id: "ID.AM-5",
        title: "Resources are prioritized based on their classification, criticality, and business value",
        description: "Prioritize resources according to their importance to business operations",
        cyfunLevel: "basic",
        guidance: [
          "Classify assets based on sensitivity",
          "Determine business impact",
          "Document prioritization criteria"
        ],
        references: [
          { name: "ISO 27001", clause: "A.8.2.1" }
        ]
      },

      // Governance
      {
        id: "ID.GV-1",
        title: "Organizational cybersecurity policy is established and communicated",
        description: "Establish and communicate organizational information security policies",
        cyfunLevel: "basic",
        guidance: [
          "Create written security policies",
          "Ensure policies are approved by management",
          "Communicate policies to all stakeholders"
        ],
        references: [
          { name: "ISO 27001", clause: "A.5.1.1" }
        ],
        isKeyMeasure: true
      },
      {
        id: "ID.GV-3",
        title: "Legal and regulatory requirements regarding cybersecurity are understood and managed",
        description: "Understand and manage legal and regulatory requirements",
        cyfunLevel: "basic",
        guidance: [
          "Identify applicable regulations",
          "Monitor regulatory changes",
          "Document compliance requirements"
        ],
        references: [
          { name: "ISO 27001", clause: "A.18.1.1" }
        ]
      },
      {
        id: "ID.GV-4",
        title: "Governance and risk management processes address cybersecurity risks",
        description: "Include cybersecurity risks in governance and risk management processes",
        cyfunLevel: "basic",
        guidance: [
          "Integrate security into risk management",
          "Regular risk assessments",
          "Document risk decisions"
        ],
        references: [
          { name: "ISO 27001", clause: "A.6.1.1" }
        ]
      },

      // Risk Assessment
      {
        id: "ID.RA-1",
        title: "Asset vulnerabilities are identified and documented",
        description: "Identify and document asset vulnerabilities",
        cyfunLevel: "basic",
        guidance: [
          "Regular vulnerability assessments",
          "Document findings",
          "Track remediation"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.6.1" }
        ]
      },
      {
        id: "ID.RA-5",
        title: "Threats, vulnerabilities, likelihoods, and impacts are used to determine risk",
        description: "Use risk factors to determine overall risk levels",
        cyfunLevel: "basic",
        guidance: [
          "Document risk assessment methodology",
          "Consider multiple risk factors",
          "Regular risk reviews"
        ],
        references: [
          { name: "ISO 27001", clause: "A.8.2.1" }
        ]
      }
    ]
  },
  {
    name: "PROTECT",
    description: "Develop and implement appropriate safeguards to ensure delivery of critical services",
    controls: [
      // Identity Management & Access Control
      {
        id: "PR.AC-1",
        title: "Identities and credentials are issued, managed, verified, revoked, and audited",
        description: "Manage identity and access credentials throughout their lifecycle",
        cyfunLevel: "basic",
        guidance: [
          "Implement identity management processes",
          "Regular access reviews",
          "Prompt revocation procedures"
        ],
        references: [
          { name: "ISO 27001", clause: "A.9.2.1" }
        ],
        isKeyMeasure: true
      },
      {
        id: "PR.AC-3",
        title: "Remote access is managed",
        description: "Manage all remote access to organizational systems",
        cyfunLevel: "basic",
        guidance: [
          "Secure remote access methods",
          "Monitor remote connections",
          "Enforce access policies"
        ],
        references: [
          { name: "ISO 27001", clause: "A.6.2.2" }
        ]
      },

      // Data Security
      {
        id: "PR.DS-1",
        title: "Data-at-rest is protected",
        description: "Implement protection for data-at-rest",
        cyfunLevel: "basic",
        guidance: [
          "Use encryption for sensitive data",
          "Secure storage systems",
          "Regular backup procedures"
        ],
        references: [
          { name: "ISO 27001", clause: "A.10.1.1" }
        ]
      },
      {
        id: "PR.DS-2",
        title: "Data-in-transit is protected",
        description: "Protect data during electronic transmission",
        cyfunLevel: "basic",
        guidance: [
          "Use secure protocols",
          "Encrypt sensitive transmissions",
          "Monitor data transfers"
        ],
        references: [
          { name: "ISO 27001", clause: "A.13.2.1" }
        ]
      },

      // Information Protection Processes
      {
        id: "PR.IP-1",
        title: "A baseline configuration of systems is created and maintained",
        description: "Maintain baseline configurations for systems",
        cyfunLevel: "basic",
        guidance: [
          "Document baseline configurations",
          "Regular reviews and updates",
          "Change management procedures"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.1.2" }
        ]
      },
      {
        id: "PR.IP-3",
        title: "Configuration change control processes are in place",
        description: "Control changes to system configurations",
        cyfunLevel: "basic",
        guidance: [
          "Change management process",
          "Configuration monitoring",
          "Documentation requirements"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.1.2" }
        ]
      },
      {
        id: "PR.IP-4",
        title: "Backups of information are conducted, maintained, and tested",
        description: "Maintain and test information backups",
        cyfunLevel: "basic",
        guidance: [
          "Regular backup schedule",
          "Backup testing procedures",
          "Secure backup storage"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.3.1" }
        ],
        isKeyMeasure: true
      },

      // Maintenance
      {
        id: "PR.MA-1",
        title: "Maintenance and repair of organizational assets is performed",
        description: "Maintain and repair organizational assets",
        cyfunLevel: "basic",
        guidance: [
          "Scheduled maintenance",
          "Authorized repair procedures",
          "Maintenance logging"
        ],
        references: [
          { name: "ISO 27001", clause: "A.11.2.4" }
        ]
      },

      // Protective Technology
      {
        id: "PR.PT-1",
        title: "Audit/log records are determined, documented, implemented, and reviewed",
        description: "Implement and maintain audit logging",
        cyfunLevel: "basic",
        guidance: [
          "Define logging requirements",
          "Regular log reviews",
          "Log retention policies"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.4.1" }
        ]
      }
    ]
  },
  {
    name: "DETECT",
    description: "Develop and implement appropriate activities to identify the occurrence of a cybersecurity event",
    controls: [
      // Anomalies and Events
      {
        id: "DE.AE-3",
        title: "Event data are collected and correlated from multiple sources and sensors",
        description: "Collect and correlate security event data",
        cyfunLevel: "basic",
        guidance: [
          "Implement event collection",
          "Correlate security data",
          "Monitor multiple sources"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.4.1" }
        ]
      },

      // Security Continuous Monitoring
      {
        id: "DE.CM-1",
        title: "The network is monitored to detect potential cybersecurity events",
        description: "Monitor network activity for security events",
        cyfunLevel: "basic",
        guidance: [
          "Network monitoring tools",
          "Alert configuration",
          "Regular monitoring reviews"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.4.1" }
        ],
        isKeyMeasure: true
      },
      {
        id: "DE.CM-3",
        title: "Personnel activity is monitored to detect potential cybersecurity events",
        description: "Monitor user activities for security events",
        cyfunLevel: "basic",
        guidance: [
          "User activity monitoring",
          "Access logging",
          "Behavior analysis"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.4.1" }
        ]
      },
      {
        id: "DE.CM-4",
        title: "Malicious code is detected",
        description: "Implement malicious code detection",
        cyfunLevel: "basic",
        guidance: [
          "Antimalware solutions",
          "Regular updates",
          "Incident response procedures"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.2.1" }
        ]
      },

      // Detection Processes
      {
        id: "DE.DP-1",
        title: "Roles and responsibilities for detection are well defined",
        description: "Define detection roles and responsibilities",
        cyfunLevel: "basic",
        guidance: [
          "Document responsibilities",
          "Train personnel",
          "Regular reviews"
        ],
        references: [
          { name: "ISO 27001", clause: "A.6.1.1" }
        ]
      }
    ]
  },
  {
    name: "RESPOND",
    description: "Develop and implement appropriate activities to take action regarding a detected cybersecurity event",
    controls: [
      // Response Planning
      {
        id: "RS.RP-1",
        title: "Response plan is executed during or after an incident",
        description: "Execute incident response plan",
        cyfunLevel: "basic",
        guidance: [
          "Document response procedures",
          "Regular plan testing",
          "Post-incident review"
        ],
        references: [
          { name: "ISO 27001", clause: "A.16.1.5" }
        ],
        isKeyMeasure: true
      },

      // Analysis
      {
        id: "RS.AN-1",
        title: "Notifications from detection systems are investigated",
        description: "Investigate security alerts",
        cyfunLevel: "basic",
        guidance: [
          "Alert triage procedures",
          "Investigation process",
          "Documentation requirements"
        ],
        references: [
          { name: "ISO 27001", clause: "A.16.1.5" }
        ]
      },

      // Mitigation
      {
        id: "RS.MI-1",
        title: "Incidents are contained",
        description: "Contain security incidents",
        cyfunLevel: "basic",
        guidance: [
          "Containment procedures",
          "Impact limitation",
          "Evidence preservation"
        ],
        references: [
          { name: "ISO 27001", clause: "A.16.1.5" }
        ]
      }
    ]
  },
  {
    name: "RECOVER",
    description: "Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity event",
    controls: [
      // Recovery Planning
      {
        id: "RC.RP-1",
        title: "Recovery plan is executed during or after a cybersecurity incident",
        description: "Execute recovery procedures",
        cyfunLevel: "basic",
        guidance: [
          "Document recovery procedures",
          "Test recovery plans",
          "Post-recovery review"
        ],
        references: [
          { name: "ISO 27001", clause: "A.17.1.2" }
        ]
      },

      // Improvements
      {
        id: "RC.IM-1",
        title: "Recovery plans incorporate lessons learned",
        description: "Update recovery plans based on lessons learned",
        cyfunLevel: "basic",
        guidance: [
          "Document lessons learned",
          "Update procedures",
          "Stakeholder communication"
        ],
        references: [
          { name: "ISO 27001", clause: "A.16.1.6" }
        ]
      }
    ]
  }
];