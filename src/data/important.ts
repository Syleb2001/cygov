import type { Category } from '../types';

export const importantCategories: Category[] = [
  {
    name: "IDENTIFY",
    description: "Develop organizational understanding to manage cybersecurity risks to systems, assets, data, and capabilities",
    controls: [
      // Business Environment
      {
        id: "ID.BE-1",
        title: "The organization's role in the supply chain is identified and communicated",
        description: "Identify and communicate the organization's role in the supply chain",
        cyfunLevel: "important",
        guidance: [
          "Document supply chain relationships",
          "Identify critical dependencies",
          "Maintain communication channels"
        ],
        references: [
          { name: "ISO 27001", clause: "A.15.1.1" }
        ]
      },
      {
        id: "ID.BE-2",
        title: "The organization's place in critical infrastructure and its industry sector is identified and communicated",
        description: "Understand and communicate critical infrastructure role",
        cyfunLevel: "important",
        guidance: [
          "Identify sector dependencies",
          "Document critical services",
          "Maintain sector relationships"
        ],
        references: [
          { name: "ISO 27001", clause: "A.6.1.1" }
        ]
      },
      {
        id: "ID.BE-3",
        title: "Priorities for organizational mission, objectives, and activities are established and communicated",
        description: "Establish organizational priorities and objectives",
        cyfunLevel: "important",
        guidance: [
          "Define mission priorities",
          "Document business objectives",
          "Communicate to stakeholders"
        ],
        references: [
          { name: "ISO 27001", clause: "A.5.1.1" }
        ]
      },

      // Supply Chain Risk Management
      {
        id: "ID.SC-1",
        title: "Cyber supply chain risk management processes are identified, established, assessed, managed, and agreed to by organizational stakeholders",
        description: "Establish supply chain risk management processes",
        cyfunLevel: "important",
        guidance: [
          "Develop risk management strategy",
          "Assess supplier risks",
          "Monitor supply chain"
        ],
        references: [
          { name: "ISO 27001", clause: "A.15.1.1" }
        ]
      }
    ]
  },
  {
    name: "PROTECT",
    description: "Develop and implement appropriate safeguards to ensure delivery of critical services",
    controls: [
      // Access Control
      {
        id: "PR.AC-4",
        title: "Access permissions and authorizations are managed, incorporating the principles of least privilege and separation of duties",
        description: "Manage access permissions following security principles",
        cyfunLevel: "important",
        guidance: [
          "Implement least privilege",
          "Define separation of duties",
          "Regular access reviews"
        ],
        references: [
          { name: "ISO 27001", clause: "A.9.2.3" }
        ]
      },
      {
        id: "PR.AC-5",
        title: "Network integrity is protected, incorporating network segregation where appropriate",
        description: "Protect network integrity through segregation",
        cyfunLevel: "important",
        guidance: [
          "Implement network segmentation",
          "Define security zones",
          "Monitor network boundaries"
        ],
        references: [
          { name: "ISO 27001", clause: "A.13.1.3" }
        ]
      },

      // Data Security
      {
        id: "PR.DS-3",
        title: "Assets are formally managed throughout removal, transfers, and disposition",
        description: "Manage asset lifecycle",
        cyfunLevel: "important",
        guidance: [
          "Document asset procedures",
          "Secure disposal methods",
          "Track asset transfers"
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
        id: "DE.CM-2",
        title: "The physical environment is monitored to detect potential cybersecurity events",
        description: "Monitor physical environment",
        cyfunLevel: "important",
        guidance: [
          "Physical access controls",
          "Environmental monitoring",
          "Security system maintenance"
        ],
        references: [
          { name: "ISO 27001", clause: "A.11.1.1" }
        ]
      }
    ]
  },
  {
    name: "RESPOND",
    description: "Develop and implement appropriate activities to take action regarding a detected cybersecurity event",
    controls: [
      // Communications
      {
        id: "RS.CO-2",
        title: "Incidents are reported consistent with established criteria",
        description: "Report incidents according to criteria",
        cyfunLevel: "important",
        guidance: [
          "Define reporting procedures",
          "Establish criteria",
          "Train personnel"
        ],
        references: [
          { name: "ISO 27001", clause: "A.16.1.2" }
        ]
      }
    ]
  },
  {
    name: "RECOVER",
    description: "Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity event",
    controls: [
      // Communications
      {
        id: "RC.CO-2",
        title: "Reputation is repaired after an incident",
        description: "Manage reputation recovery",
        cyfunLevel: "important",
        guidance: [
          "Communication strategy",
          "Stakeholder management",
          "Media relations"
        ],
        references: [
          { name: "ISO 27001", clause: "A.16.1.8" }
        ]
      }
    ]
  }
];