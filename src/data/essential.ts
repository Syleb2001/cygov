import type { Category } from '../types';

export const essentialCategories: Category[] = [
  {
    name: "IDENTIFY",
    description: "Develop organizational understanding to manage cybersecurity risks to systems, assets, data, and capabilities",
    controls: [
      // Asset Management
      {
        id: "ID.AM-4",
        title: "External information systems are catalogued",
        description: "Maintain inventory of external systems",
        cyfunLevel: "essential",
        guidance: [
          "Document external dependencies",
          "Assess security requirements",
          "Monitor connections"
        ],
        references: [
          { name: "ISO 27001", clause: "A.8.1.1" }
        ]
      },
      {
        id: "ID.AM-6",
        title: "Cybersecurity roles and responsibilities are established",
        description: "Define security roles and responsibilities",
        cyfunLevel: "essential",
        guidance: [
          "Document security roles",
          "Assign responsibilities",
          "Regular reviews"
        ],
        references: [
          { name: "ISO 27001", clause: "A.6.1.1" }
        ]
      },

      // Risk Management Strategy
      {
        id: "ID.RM-1",
        title: "Risk management processes are established, managed, and agreed to by organizational stakeholders",
        description: "Establish risk management processes",
        cyfunLevel: "essential",
        guidance: [
          "Define risk strategy",
          "Stakeholder approval",
          "Regular updates"
        ],
        references: [
          { name: "ISO 27001", clause: "A.6.1.1" }
        ]
      }
    ]
  },
  {
    name: "PROTECT",
    description: "Develop and implement appropriate safeguards to ensure delivery of critical services",
    controls: [
      // Data Security
      {
        id: "PR.DS-4",
        title: "Adequate capacity to ensure availability is maintained",
        description: "Maintain system capacity",
        cyfunLevel: "essential",
        guidance: [
          "Capacity planning",
          "Performance monitoring",
          "Resource management"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.1.3" }
        ]
      },
      {
        id: "PR.DS-5",
        title: "Protections against data leaks are implemented",
        description: "Prevent data leakage",
        cyfunLevel: "essential",
        guidance: [
          "DLP implementation",
          "Monitor data transfers",
          "Access controls"
        ],
        references: [
          { name: "ISO 27001", clause: "A.13.2.1" }
        ]
      },

      // Protective Technology
      {
        id: "PR.PT-2",
        title: "Removable media is protected and its use restricted according to policy",
        description: "Control removable media",
        cyfunLevel: "essential",
        guidance: [
          "Media use policies",
          "Device controls",
          "Data encryption"
        ],
        references: [
          { name: "ISO 27001", clause: "A.8.3.1" }
        ]
      }
    ]
  },
  {
    name: "DETECT",
    description: "Develop and implement appropriate activities to identify the occurrence of a cybersecurity event",
    controls: [
      // Security Continuous Monitoring
      {
        id: "DE.CM-5",
        title: "Unauthorized mobile code is detected",
        description: "Detect unauthorized code",
        cyfunLevel: "essential",
        guidance: [
          "Code monitoring",
          "Execution controls",
          "Policy enforcement"
        ],
        references: [
          { name: "ISO 27001", clause: "A.12.5.1" }
        ]
      }
    ]
  },
  {
    name: "RESPOND",
    description: "Develop and implement appropriate activities to take action regarding a detected cybersecurity event",
    controls: [
      // Analysis
      {
        id: "RS.AN-3",
        title: "Forensics are performed",
        description: "Conduct forensic analysis",
        cyfunLevel: "essential",
        guidance: [
          "Evidence collection",
          "Analysis procedures",
          "Chain of custody"
        ],
        references: [
          { name: "ISO 27001", clause: "A.16.1.7" }
        ]
      }
    ]
  },
  {
    name: "RECOVER",
    description: "Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity event",
    controls: [
      // Improvements
      {
        id: "RC.IM-2",
        title: "Recovery strategies are updated",
        description: "Update recovery strategies",
        cyfunLevel: "essential",
        guidance: [
          "Strategy review",
          "Incorporate lessons",
          "Update documentation"
        ],
        references: [
          { name: "ISO 27001", clause: "A.16.1.6" }
        ]
      }
    ]
  }
];