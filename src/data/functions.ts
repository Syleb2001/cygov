import type { Function } from '../types';

export const functions: Function[] = [
  {
    id: "ID",
    name: "IDENTIFY",
    description: "Develop organizational understanding to manage cybersecurity risks to systems, assets, data, and capabilities",
    categories: [
      {
        id: "ID.AM",
        name: "Asset Management",
        description: "The data, personnel, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed",
        subcategories: [
          {
            id: "ID.AM-1",
            title: "Physical devices and systems are inventoried",
            description: "Physical devices and systems within the organization are inventoried",
            requirements: [
              {
                id: "ID.AM-1.1",
                title: "Maintain current inventory of physical devices",
                description: "Maintain a current inventory of all physical devices within the organization",
                cyfunLevel: "basic",
                subcategoryId: "ID.AM-1",
                guidance: [
                  "Create and maintain an inventory of all organizational assets",
                  "Include all devices that could connect to networks",
                  "Update inventory regularly"
                ],
                references: [
                  { name: "CSA CCM", clause: "AIS-01" },
                  { name: "ISO 27001", clause: "A.8.1.1" }
                ]
              }
            ]
          },
          {
            id: "ID.AM-2",
            title: "Software platforms and applications are inventoried",
            description: "Software platforms and applications within the organization are inventoried",
            requirements: [
              {
                id: "ID.AM-2.1",
                title: "Maintain current inventory of software",
                description: "Maintain a current inventory of all software platforms and applications",
                cyfunLevel: "basic",
                subcategoryId: "ID.AM-2",
                guidance: [
                  "Document all authorized software",
                  "Include version information",
                  "Track software licenses"
                ],
                references: [
                  { name: "CSA CCM", clause: "AIS-02" },
                  { name: "ISO 27001", clause: "A.8.1.1" }
                ]
              }
            ]
          },
          {
            id: "ID.AM-3",
            title: "Organizational communication and data flows are mapped",
            description: "Map communication and data flows within the organization",
            requirements: [
              {
                id: "ID.AM-3.1",
                title: "Map data flows",
                description: "Map organizational communication and data flows",
                cyfunLevel: "basic",
                subcategoryId: "ID.AM-3",
                guidance: [
                  "Document data flow diagrams",
                  "Identify critical communication paths",
                  "Update maps when changes occur"
                ],
                references: [
                  { name: "CSA CCM", clause: "DSI-02" }
                ]
              }
            ]
          },
          {
            id: "ID.AM-5",
            title: "Resources are prioritized",
            description: "Resources are prioritized based on their classification, criticality, and business value",
            requirements: [
              {
                id: "ID.AM-5.1",
                title: "Prioritize resources",
                description: "Prioritize resources based on classification and business value",
                cyfunLevel: "basic",
                subcategoryId: "ID.AM-5",
                guidance: [
                  "Classify assets based on sensitivity",
                  "Determine business impact",
                  "Document prioritization criteria"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.8.2.1" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "ID.GV",
        name: "Governance",
        description: "The policies, procedures, and processes to manage and monitor the organization's regulatory, legal, risk, environmental, and operational requirements",
        subcategories: [
          {
            id: "ID.GV-1",
            title: "Organizational cybersecurity policy is established",
            description: "Organizational information security policies are established and communicated",
            requirements: [
              {
                id: "ID.GV-1.1",
                title: "Establish security policies",
                description: "Establish and communicate organizational cybersecurity policies",
                cyfunLevel: "basic",
                subcategoryId: "ID.GV-1",
                guidance: [
                  "Create written security policies",
                  "Ensure policies are approved by management",
                  "Communicate policies to all stakeholders"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.5.1.1" }
                ]
              }
            ]
          },
          {
            id: "ID.GV-3",
            title: "Legal and regulatory requirements are understood",
            description: "Legal and regulatory requirements regarding cybersecurity are understood and managed",
            requirements: [
              {
                id: "ID.GV-3.1",
                title: "Manage legal requirements",
                description: "Understand and manage cybersecurity legal requirements",
                cyfunLevel: "basic",
                subcategoryId: "ID.GV-3",
                guidance: [
                  "Identify applicable regulations",
                  "Monitor regulatory changes",
                  "Document compliance requirements"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.18.1.1" }
                ]
              }
            ]
          },
          {
            id: "ID.GV-4",
            title: "Governance and risk management processes address cybersecurity risks",
            description: "Include cybersecurity risks in governance and risk management processes",
            requirements: [
              {
                id: "ID.GV-4.1",
                title: "Include security in risk management",
                description: "Address cybersecurity risks in governance processes",
                cyfunLevel: "basic",
                subcategoryId: "ID.GV-4",
                guidance: [
                  "Integrate security into risk management",
                  "Regular risk assessments",
                  "Document risk decisions"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.6.1.1" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "ID.RA",
        name: "Risk Assessment",
        description: "The organization understands the cybersecurity risk to organizational operations, organizational assets, and individuals",
        subcategories: [
          {
            id: "ID.RA-1",
            title: "Asset vulnerabilities are identified and documented",
            description: "Identify and document asset vulnerabilities",
            requirements: [
              {
                id: "ID.RA-1.1",
                title: "Document vulnerabilities",
                description: "Identify and document asset vulnerabilities",
                cyfunLevel: "basic",
                subcategoryId: "ID.RA-1",
                guidance: [
                  "Regular vulnerability assessments",
                  "Document findings",
                  "Track remediation"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.12.6.1" }
                ]
              }
            ]
          },
          {
            id: "ID.RA-5",
            title: "Threats, vulnerabilities, likelihoods, and impacts are used to determine risk",
            description: "Use risk factors to determine overall risk levels",
            requirements: [
              {
                id: "ID.RA-5.1",
                title: "Determine risks",
                description: "Use multiple factors to determine risk",
                cyfunLevel: "basic",
                subcategoryId: "ID.RA-5",
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
          }
        ]
      }
    ]
  },
  {
    id: "PR",
    name: "PROTECT",
    description: "Develop and implement appropriate safeguards to ensure delivery of critical infrastructure services",
    categories: [
      {
        id: "PR.AC",
        name: "Identity Management & Access Control",
        description: "Access to physical and logical assets and associated facilities is limited to authorized users, processes, and devices",
        subcategories: [
          {
            id: "PR.AC-1",
            title: "Identities and credentials are managed",
            description: "Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users and processes",
            requirements: [
              {
                id: "PR.AC-1.1",
                title: "Manage identities and credentials",
                description: "Manage identity and access credentials throughout their lifecycle",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-1",
                guidance: [
                  "Implement identity management processes",
                  "Regular access reviews",
                  "Prompt revocation procedures"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.9.2.1" }
                ]
              }
            ]
          },
          {
            id: "PR.AC-3",
            title: "Remote access is managed",
            description: "Remote access is managed",
            requirements: [
              {
                id: "PR.AC-3.1",
                title: "Manage remote access",
                description: "Manage all remote access to organizational systems",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-3",
                guidance: [
                  "Secure remote access methods",
                  "Monitor remote connections",
                  "Enforce access policies"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.6.2.2" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "PR.DS",
        name: "Data Security",
        description: "Information and records (data) are managed consistent with the organization's risk strategy to protect the confidentiality, integrity, and availability of information",
        subcategories: [
          {
            id: "PR.DS-1",
            title: "Data-at-rest is protected",
            description: "Data-at-rest is protected",
            requirements: [
              {
                id: "PR.DS-1.1",
                title: "Protect stored data",
                description: "Implement protection for data-at-rest",
                cyfunLevel: "basic",
                subcategoryId: "PR.DS-1",
                guidance: [
                  "Use encryption for sensitive data",
                  "Secure storage systems",
                  "Regular backup procedures"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.10.1.1" }
                ]
              }
            ]
          },
          {
            id: "PR.DS-2",
            title: "Data-in-transit is protected",
            description: "Data-in-transit is protected",
            requirements: [
              {
                id: "PR.DS-2.1",
                title: "Protect data in transit",
                description: "Protect data during electronic transmission",
                cyfunLevel: "basic",
                subcategoryId: "PR.DS-2",
                guidance: [
                  "Use secure protocols",
                  "Encrypt sensitive transmissions",
                  "Monitor data transfers"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.13.2.1" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "PR.IP",
        name: "Information Protection Processes and Procedures",
        description: "Security policies, processes, and procedures are maintained and used to manage protection of information systems and assets",
        subcategories: [
          {
            id: "PR.IP-4",
            title: "Backups of information are conducted, maintained, and tested",
            description: "Backups for organization's business-critical data shall be conducted and stored on a system different from the device on which the original data resides (key measure)",
            requirements: [
              {
                id: "PR.IP-4.1",
                title: "Conduct and store backups off the primary system",
                description: "Perform regular backups of critical data and store them offline or on separate systems to protect against ransomware or loss.",
                cyfunLevel: "basic",
                subcategoryId: "PR.IP-4",
                guidance: [
                  "Include software, configurations, documentation, and other critical data in backups",
                  "Consider offline (disconnected) backups periodically",
                  "Review recovery time and point objectives",
                  "Ensure backups are not on the same network as primary data"
                ],
                references: [
                  { name: "CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)", clause: "Critical Security Control 11" },
                  { name: "IEC 62443-2-1:2010", clause: "Clause 4.3.4.3.9" },
                  { name: "IEC 62443-3-3:2013", clause: "SR 7.3, SR 7.4" },
                  { name: "ISO/IEC 27001:2022 (NBN ISO/IEC 27001:2023)", clause: "Clause 7.5, 8.1, Annex A (see ISO 27002)" },
                  { name: "ISO/IEC 27002:2022 (NBN EN ISO/IEC 27002:2022)", clause: "Control 5.29, 5.33, 8.13" }
                ]
              }
            ]
          },
          {
            id: "PR.IP-11",
            title: "Cybersecurity is included in human resources practices (deprovisioning, personnel screening…)",
            description: "Personnel having access to the organization's most critical information or technology shall be verified",
            requirements: [
              {
                id: "PR.IP-11.1",
                title: "Verify personnel for critical access",
                description: "Perform screening and define processes to ensure trustworthiness of personnel who have access to sensitive information or technology.",
                cyfunLevel: "basic",
                subcategoryId: "PR.IP-11",
                guidance: [
                  "Apply background checks for staff with privileged or critical access",
                  "Review access rights at hiring, during employment, and upon termination",
                  "Ensure compliance with local legal and privacy requirements"
                ],
                references: [
                  { name: "CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)", clause: "Critical Security Control 4, 6" },
                  { name: "IEC 62443-2-1:2010", clause: "Clause 4.3.3.2.1, 4.3.3.2.2, 4.3.3.2.3" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "DE",
    name: "DETECT",
    description: "Develop and implement appropriate activities to identify the occurrence of a cybersecurity event",
    categories: [
      {
        id: "DE.AE",
        name: "Anomalies and Events",
        description: "Anomalous activity is detected and the potential impact of events is understood",
        subcategories: [
          {
            id: "DE.AE-3",
            title: "Event data are collected and correlated",
            description: "Event data are collected and correlated from multiple sources and sensors",
            requirements: [
              {
                id: "DE.AE-3.1",
                title: "Collect and correlate event data",
                description: "Collect and correlate security event data from multiple sources",
                cyfunLevel: "basic",
                subcategoryId: "DE.AE-3",
                guidance: [
                  "Implement event collection",
                  "Correlate security data",
                  "Monitor multiple sources"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.12.4.1" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "DE.CM",
        name: "Security Continuous Monitoring",
        description: "The information system and assets are monitored to identify cybersecurity events and verify the effectiveness of protective measures",
        subcategories: [
          {
            id: "DE.CM-1",
            title: "The network is monitored",
            description: "The network is monitored to detect potential cybersecurity events",
            requirements: [
              {
                id: "DE.CM-1.1",
                title: "Monitor network activity",
                description: "Monitor network for security events",
                cyfunLevel: "basic",
                subcategoryId: "DE.CM-1",
                guidance: [
                  "Network monitoring tools",
                  "Alert configuration",
                  "Regular monitoring reviews"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.12.4.1" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "RS",
    name: "RESPOND",
    description: "Develop and implement appropriate activities to take action regarding a detected cybersecurity event",
    categories: [
      {
        id: "RS.RP",
        name: "Response Planning",
        description: "Response processes and procedures are executed and maintained",
        subcategories: [
          {
            id: "RS.RP-1",
            title: "Response plan is executed",
            description: "Response plan is executed during or after an incident",
            requirements: [
              {
                id: "RS.RP-1.1",
                title: "Execute response plan",
                description: "Execute incident response plan when needed",
                cyfunLevel: "basic",
                subcategoryId: "RS.RP-1",
                guidance: [
                  "Document response procedures",
                  "Regular plan testing",
                  "Post-incident review"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.16.1.5" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "RC",
    name: "RECOVER",
    description: "Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity event",
    categories: [
      {
        id: "RC.RP",
        name: "Recovery Planning",
        description: "Recovery processes and procedures are executed and maintained",
        subcategories: [
          {
            id: "RC.RP-1",
            title: "Recovery plan is executed",
            description: "Recovery plan is executed during or after a cybersecurity incident",
            requirements: [
              {
                id: "RC.RP-1.1",
                title: "Execute recovery plan",
                description: "Execute recovery procedures after incidents",
                cyfunLevel: "basic",
                subcategoryId: "RC.RP-1",
                guidance: [
                  "Document recovery procedures",
                  "Test recovery plans",
                  "Post-recovery review"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.17.1.2" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];