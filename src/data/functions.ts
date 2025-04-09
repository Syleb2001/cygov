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
        description: "The data, personnel, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization's risk strategy",
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
                isKeyMeasure: false,
                guidance: [
                  "Create and maintain an inventory of all organizational assets",
                  "Include all devices that could connect to networks",
                  "Update inventory regularly"
                ],
                references: [
                  { name: "CSA CCM", clause: "AIS-01" },
                  { name: "ISO 27001", clause: "A.8.1.1" }
                ]
              },
              {
                id: "ID.AM-1.3",
                title: "Handle unauthorized hardware",
                description: "When unauthorized hardware is detected, it shall be quarantined for possible exception handling, removed, or replaced, and the inventory shall be updated accordingly.",
                cyfunLevel: "important",
                subcategoryId: "ID.AM-1",
                guidance: [
                  "Any unsupported hardware without an exception documentation, is designated as unauthorized.",
                  "Unauthorized hardware can be detected during inventory, requests for support by the user or other means."
                ],
                references: [
                  { name: "ISO 27001", clause: "A.8.1.1" }
                ]
              }
            ]
          },
          {
            id: "ID.AM-2",
            title: "Software platforms and applications within the organization are inventoried",
            description: "Software platforms and applications used within the organization are inventoried",
            requirements: [
              {
                id: "ID.AM-2.1",
                title: "Maintain software inventory",
                description: "An inventory that reflects what software platforms and applications are being used in the organization shall be documented, reviewed, and updated when changes occur",
                cyfunLevel: "basic",
                subcategoryId: "ID.AM-2",
                guidance: [
                  "This inventory includes software programs, software platforms and databases, even if outsourced (SaaS)",
                  "Outsourcing arrangements should be part of the contractual agreements with the provider",
                  "Information in the inventory should include for example: name, description, version, number of users, data processed, etc.",
                  "A distinction should be made between unsupported software and unauthorized software",
                  "The use of an IT asset management tool could be considered"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.8.1.1" },
                  { name: "NIST SP 800-53", clause: "CM-8" }
                ]
              },
              {
                id: "ID.AM-2.3",
                title: "Identify software administrators",
                description: "Individuals who are responsible and who are accountable for administering software platforms and applications within the organization shall be identified.",
                cyfunLevel: "important",
                subcategoryId: "ID.AM-2",
                guidance: [
                  "There are no additional guidelines."
                ],
                references: [
                  { name: "ISO 27001", clause: "A.6.1.1" }
                ]
              },
              {
                id: "ID.AM-2.4",
                title: "Handle unauthorized software",
                description: "When unauthorized software is detected, it shall be quarantined for possible exception handling, removed, or replaced, and the inventory shall be updated accordingly.",
                cyfunLevel: "important",
                subcategoryId: "ID.AM-2",
                guidance: [
                  "Any unsupported software without an exception documentation, is designated as unauthorized.",
                  "Unauthorized software can be detected during inventory, requests for support by the user or other means."
                ],
                references: [
                  { name: "ISO 27001", clause: "A.12.6.2" }
                ]
              }
            ]
          },
          {
            id: "ID.AM-3",
            title: "Organizational communication and data flows are mapped",
            description: "Organizational communication and data flows are mapped",
            requirements: [
              {
                id: "ID.AM-3.1",
                title: "Identify and map information flows",
                description: "Information that the organization stores and uses shall be identified",
                cyfunLevel: "basic",
                subcategoryId: "ID.AM-3",
                guidance: [
                  "Start by listing all the types of information your business stores or uses",
                  "Define 'information type' in any useful way that makes sense to your business",
                  "You may want to have your employees make a list of all the information they use in their regular activities",
                  "List everything you can think of, but you do not need to be too specific",
                  "For example, you may keep customer names and email addresses, receipts for raw material, your banking information, or other proprietary information",
                  "Consider mapping this information with the associated assets identified in the inventories of physical devices, systems, software platforms and applications used within the organization (see ID.AM-1 & ID.AM-2)"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.8.2.1" },
                  { name: "NIST SP 800-53", clause: "AC-4" }
                ]
              }
            ]
          },
          {
            id: "ID.AM-5",
            title: "Resources are prioritized based on their classification, criticality, and business value",
            description: "Resources (e.g., hardware, devices, data, time, personnel, and software) are prioritized based on their classification, criticality, and business value",
            requirements: [
              {
                id: "ID.AM-5.1",
                title: "Prioritize organization's resources",
                description: "The organization's resources (hardware, devices, data, time, personnel, information, and software) shall be prioritized based on their classification, criticality, and business value",
                cyfunLevel: "basic",
                subcategoryId: "ID.AM-5",
                guidance: [
                  "Determine organization's resources (e.g., hardware, devices, data, time, personnel, information, and software)",
                  "What would happen to my business if these resources were made public, damaged, lost...?",
                  "What would happen to my business when the integrity of resources is no longer guaranteed?",
                  "What would happen to my business if my customers couldn't access these resources?",
                  "And rank these resources based on their classification, criticality, and business value",
                  "Resources should include enterprise assets"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.8.2.1" },
                  { name: "NIST SP 800-53", clause: "RA-2" }
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
            description: "Legal and regulatory requirements regarding cybersecurity, including privacy and civil liberties obligations, are understood and managed",
            requirements: [
              {
                id: "ID.GV-3.1",
                title: "Understand and implement legal requirements",
                description: "Legal and regulatory requirements regarding information/cybersecurity, including privacy obligations, shall be understood and implemented",
                cyfunLevel: "basic",
                subcategoryId: "ID.GV-3",
                guidance: [
                  "There are no additional guidelines."
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
            description: "Governance and risk management processes address cybersecurity risks",
            requirements: [
              {
                id: "ID.GV-4.1",
                title: "Develop comprehensive security strategy",
                description: "As part of the company's overall risk management, a comprehensive strategy to manage information security and cybersecurity risks shall be developed and updated when changes occur",
                cyfunLevel: "basic",
                subcategoryId: "ID.GV-4",
                guidance: [
                  "This strategy should include determining and allocating the required resources to protect the organisation's business-critical assets"
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
        description: "The organization understands the cybersecurity risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals",
        subcategories: [
          {
            id: "ID.RA-1",
            title: "Asset vulnerabilities are identified and documented",
            description: "Asset vulnerabilities are identified and documented",
            requirements: [
              {
                id: "ID.RA-1.1",
                title: "Identify threats and vulnerabilities",
                description: "Threats and vulnerabilities shall be identified",
                cyfunLevel: "basic",
                subcategoryId: "ID.RA-1",
                isKeyMeasure: false,
                guidance: [
                  "A vulnerability refers to a weakness in the organization's hardware, software, or procedures. It is a gap through which a bad actor can gain access to the organization's assets. A vulnerability exposes an organization to threats",
                  "A threat is a malicious or negative event that takes advantage of a vulnerability",
                  "The risk is the potential for loss and damage when the threat does occur"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.8.2.1" },
                  { name: "NIST SP 800-53", clause: "RA-3" }
                ]
              }
            ]
          },
          {
            id: "ID.RA-5",
            title: "Threats, vulnerabilities, likelihoods, and impacts are used to determine risk",
            description: "Threats, vulnerabilities, likelihoods, and impacts are used to determine risk",
            requirements: [
              {
                id: "ID.RA-5.1",
                title: "Risk assessment",
                description: "The organization shall conduct risk assessments in which risk is determined by threats, vulnerabilities and impact on business processes and assets",
                cyfunLevel: "basic",
                subcategoryId: "ID.RA-5",
                isKeyMeasure: false,
                guidance: [
                  "Keep in mind that threats exploit vulnerabilities",
                  "Identify the consequences that losses of confidentiality, integrity and availability may have on the assets and related business processes"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.8.2.1" },
                  { name: "NIST SP 800-53", clause: "RA-3" }
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
                isKeyMeasure: true,
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
            id: "PR.AC-2",
            title: "Physical access to assets is managed and protected",
            description: "Physical access to assets is managed and protected",
            requirements: [
              {
                id: "PR.AC-2.1",
                title: "Physical access management",
                description: "Physical access to the facility, servers and network components shall be managed",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-2",
                isKeyMeasure: false,
                guidance: [
                  "Consider to strictly manage keys to access the premises and alarm codes. The following rules should be considered:",
                  "Always retrieve an employee's keys or badges when they leave the company permanently",
                  "Change company alarm codes frequently",
                  "Never give keys or alarm codes to external service providers (cleaning agents, etc.), unless it is possible to trace these accesses and restrict them technically to given time slots",
                  "Consider to not leaving internal network access outlets accessible in public areas. These public places can be waiting rooms, corridors..."
                ],
                references: [
                  { name: "ISO 27001", clause: "A.11.1.2" },
                  { name: "NIST SP 800-53", clause: "PE-3" }
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
              },
              {
                id: "PR.AC-3.2",
                title: "Secure remote network access",
                description: "The organization's network, when accessed remotely, shall be secured including through multi-factor authentication (MFA)",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-3",
                isKeyMeasure: true,
                guidance: [
                  "Implement MFA for all remote access",
                  "Use secure VPN or remote desktop solutions",
                  "Monitor and log remote access attempts",
                  "Regular review of remote access permissions"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.6.2.2" },
                  { name: "NIST SP 800-53", clause: "AC-17" }
                ]
              }
            ]
          },
          {
            id: "PR.AC-4",
            title: "Access permissions and authorizations are managed",
            description: "Access permissions and authorizations are managed, incorporating the principles of least privilege and separation of duties",
            requirements: [
              {
                id: "PR.AC-4.1",
                title: "Define and manage access permissions",
                description: "Access permissions for users to the organization's systems shall be defined and managed",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-4",
                isKeyMeasure: true,
                guidance: [
                  "Draw up and review regularly access lists per system",
                  "Set up a separate account for each user",
                  "Ensure strong, unique passwords for each account",
                  "Ensure all employees use computer accounts without administrative privileges",
                  "Consider separation of personal and admin accounts",
                  "Document permission management procedures"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.9.2.3" },
                  { name: "NIST SP 800-53", clause: "AC-2" }
                ]
              },
              {
                id: "PR.AC-4.2",
                title: "Identify who should have access to critical information",
                description: "It shall be identified who should have access to the organization's business's critical information and technology and the means to get access",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-4",
                isKeyMeasure: true,
                guidance: [
                  "Document access requirements for critical systems",
                  "Define appropriate authentication methods",
                  "Regularly review access rights",
                  "Implement role-based access control"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.9.2.2" },
                  { name: "NIST SP 800-53", clause: "AC-6" }
                ]
              },
              {
                id: "PR.AC-4.3",
                title: "Apply least privilege principle",
                description: "Employee access to data and information shall be limited to the systems and specific information they need to do their jobs (the principle of Least Privilege)",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-4",
                isKeyMeasure: true,
                guidance: [
                  "Implement role-based access control",
                  "Regularly review access permissions",
                  "Remove unnecessary privileges",
                  "Document and justify all access rights",
                  "Ensure access is blocked when employees leave"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.9.1.1" },
                  { name: "NIST SP 800-53", clause: "AC-6" }
                ]
              },
              {
                id: "PR.AC-4.4",
                title: "Manage administrator privileges",
                description: "Nobody shall have administrator privileges for daily business",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-4",
                isKeyMeasure: true,
                guidance: [
                  "Separate administrator accounts from user accounts",
                  "Do not use privileged accounts for daily tasks",
                  "Monitor administrator account usage",
                  "Regularly review administrator privileges",
                  "Disable or remove unused privileged accounts",
                  "Prohibit web browsing from administrative accounts"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.9.2.3" },
                  { name: "NIST SP 800-53", clause: "AC-6(5)" }
                ]
              }
            ]
          },
          {
            id: "PR.AC-5",
            title: "Network integrity is protected",
            description: "Network integrity is protected, incorporating network segregation where appropriate",
            requirements: [
              {
                id: "PR.AC-5.1",
                title: "Install and manage firewalls",
                description: "Firewalls shall be installed and activated on all the organization's networks",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-5",
                isKeyMeasure: true,
                guidance: [
                  "Install and operate a firewall between your internal network and the Internet",
                  "Ensure there is antivirus software installed",
                  "Use purchased firewall solutions and ensure they are regularly updated",
                  "Have firewalls on each of your computers and networks",
                  "Ensure that for network/home network and systems have hardware and software firewalls installed, operational, and regularly updated",
                  "Consider installing an Intrusion Detection/Prevention System (IDS/IPS)"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.13.1.2" },
                  { name: "NIST SP 800-53", clause: "SC-7" }
                ]
              },
              {
                id: "PR.AC-5.2",
                title: "Implement network segmentation",
                description: "Where appropriate, integrity of the organization's critical systems shall be protected by incorporating network segregation",
                cyfunLevel: "basic",
                subcategoryId: "PR.AC-5",
                isKeyMeasure: true,
                guidance: [
                  "Implement different security zones in the network",
                  "Segment network through VLANs or other network access control mechanisms",
                  "Control/monitor the traffic between these zones",
                  "Consider that when the network is 'flat', the compromise of a vital network component can lead to the compromise of the entire network"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.13.1.3" },
                  { name: "NIST SP 800-53", clause: "SC-7" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "PR.AT",
        name: "Awareness and Training",
        description: "The organization's personnel and partners are provided cybersecurity awareness education and are trained to perform their cybersecurity-related duties and responsibilities consistent with related policies, procedures, and agreements",
        subcategories: [
          {
            id: "PR.AT-1",
            title: "All users are informed and trained",
            description: "Employees shall be trained as appropriate",
            requirements: [
              {
                id: "PR.AT-1.1",
                title: "Train employees on security policies",
                description: "Employees shall be trained as appropriate about the company's information security policies",
                cyfunLevel: "basic",
                subcategoryId: "PR.AT-1",
                isKeyMeasure: true,
                guidance: [
                  "Employees include all users and managers of the ICT/IoT systems",
                  "Train immediately when hired and regularly thereafter",
                  "Cover company's information security policies",
                  "Explain how to protect company's business information and technology",
                  "Training should be continually updated and reinforced by awareness campaigns"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.7.2.2" },
                  { name: "NIST SP 800-53", clause: "AT-2" }
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
            id: "PR.DS-3",
            title: "Assets are formally managed throughout removal, transfers, and disposition",
            description: "Assets are formally managed throughout removal, transfers, and disposition",
            requirements: [
              {
                id: "PR.DS-3.1",
                title: "Safely dispose of assets and media",
                description: "Assets and media shall be disposed of safely",
                cyfunLevel: "basic",
                subcategoryId: "PR.DS-3",
                guidance: [
                  "When eliminating tangible assets like business computers/laptops, servers, hard drive(s) and other storage media (USB drives, paper...), ensure that all sensitive business or personal data are securely deleted",
                  "Electronically 'wipe' data before assets are removed and then physically destroyed (or re-commissioned)",
                  "Consider installing a remote-wiping application on company laptops, tablets, cell phones, and other mobile devices"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.8.3.2" },
                  { name: "NIST SP 800-53", clause: "MP-6" }
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
                isKeyMeasure: true,
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
                isKeyMeasure: true,
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
      },
      {
        id: "PR.MA",
        name: "Maintenance",
        description: "Maintenance and repairs of industrial control and information system components are performed consistent with policies and procedures",
        subcategories: [
          {
            id: "PR.MA-1",
            title: "Maintenance and repair of organizational assets are performed and logged",
            description: "Maintenance and repair of organizational assets are performed and logged, with approved and controlled tools",
            requirements: [
              {
                id: "PR.MA-1.1",
                title: "Patches and security updates",
                description: "Patches and security updates for Operating Systems and critical system components shall be installed",
                cyfunLevel: "basic",
                subcategoryId: "PR.MA-1",
                isKeyMeasure: true,
                guidance: [
                  "Limit yourself to only install most critical applications (operating systems, firmware, etc.)",
                  "Update the products you run your business and participate/update them regularly",
                  "You should only install a current and vendor-supported version of software you choose to use",
                  "It may be useful to assign a tag each month to check for updates",
                  "There are products which can scan your business and notify you when there is an update for an application you have installed",
                  "If you use one of these products, make sure it checks for updates for every application you use",
                  "Install patches and security updates in a timely manner"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.12.6.1" },
                  { name: "NIST SP 800-53", clause: "MA-2" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "PR.PT",
        name: "Protective Technology",
        description: "Technical security solutions are managed to ensure the security and resilience of systems and assets, consistent with related policies, procedures, and agreements",
        subcategories: [
          {
            id: "PR.PT-1",
            title: "Audit/log records are determined, documented, implemented, and reviewed",
            description: "Audit/log records are determined, documented, implemented, and reviewed in accordance with policy",
            requirements: [
              {
                id: "PR.PT-1.1",
                title: "Logs management",
                description: "Logs shall be maintained, documented, and reviewed",
                cyfunLevel: "basic",
                subcategoryId: "PR.PT-1",
                isKeyMeasure: true,
                guidance: [
                  "Ensure the activity logging functionality of protection / detection hardware or software (e.g. firewalls, anti-virus) is enabled",
                  "Logs should be backed up and saved for a predefined period",
                  "The logs should be reviewed for any unusual or unwanted trends, such as a large use of social media websites or an unusual number of viruses consistently found on a particular computer",
                  "These trends may indicate a more serious problem or signal the need for stronger protections in a particular area"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.12.4.1" },
                  { name: "NIST SP 800-53", clause: "AU-6" }
                ]
              }
            ]
          },
          {
            id: "PR.PT-4",
            title: "Communications and control networks are protected",
            description: "Communications and control networks are protected",
            requirements: [
              {
                id: "PR.PT-4.1",
                title: "Web and email filters",
                description: "Web and e-mail filters shall be installed and used",
                cyfunLevel: "basic",
                subcategoryId: "PR.PT-4",
                isKeyMeasure: false,
                guidance: [
                  "E-mail filters should detect malicious e-mails, and filtering should be configured based on the type of message attachments so that files of the specified types are automatically processed (e.g. deleted)",
                  "Web-filters should notify the user if a website may contain malware and potentially preventing users from accessing that website"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.13.1.1" },
                  { name: "NIST SP 800-53", clause: "SC-7" }
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
                isKeyMeasure: true,
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
                title: "Network monitoring and firewall protection",
                description: "Firewalls shall be installed and operated on the network boundaries and completed with firewall protection on the endpoints",
                cyfunLevel: "basic",
                subcategoryId: "DE.CM-1",
                isKeyMeasure: false,
                guidance: [
                  "Endpoints include desktops, laptops, servers...",
                  "Consider, where feasible, including smart phones and other networked devices when installing and operating firewalls",
                  "Consider limiting the number of interconnection gateways to the Internet"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.13.1.1" },
                  { name: "NIST SP 800-53", clause: "SI-4" }
                ]
              }
            ]
          },
          {
            id: "DE.CM-3",
            title: "Personnel activity is monitored",
            description: "Personnel activity is monitored to detect potential cybersecurity events",
            requirements: [
              {
                id: "DE.CM-3.1",
                title: "Monitor end-user behavior",
                description: "End-point and network protection tools to monitor end-user behavior for dangerous activity shall be implemented",
                cyfunLevel: "basic",
                subcategoryId: "DE.CM-3",
                isKeyMeasure: false,
                guidance: [
                  "Consider deploying an Intrusion Detection/Prevention System (IDS/IPS)"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.12.4.1" },
                  { name: "NIST SP 800-53", clause: "AC-2(12)" }
                ]
              }
            ]
          },
          {
            id: "DE.CM-4",
            title: "Malicious code is detected",
            description: "Malicious code is detected",
            requirements: [
              {
                id: "DE.CM-4.1",
                title: "Malware protection",
                description: "Anti-virus, -spyware, and other malware programs shall be installed and updated",
                cyfunLevel: "basic",
                subcategoryId: "DE.CM-4",
                isKeyMeasure: true,
                guidance: [
                  "Malware includes viruses, spyware, and ransomware and should be countered by installing, using, and regularly updating anti-virus and anti-spyware software on every device used in company's business (including computers, smart phones, tablets, and servers)",
                  "Anti-virus and anti-spyware software should automatically check for updates in 'real-time' or at least daily followed by system scanning as appropriate",
                  "It should be considered to provide the same malicious code protection mechanisms for home computers (e.g. teleworking) or personal devices that are used for professional work (BYOD)"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.12.2.1" },
                  { name: "NIST SP 800-53", clause: "SI-3" }
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
                isKeyMeasure: false,
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
      },
      {
        id: "RS.CO",
        name: "Communications",
        description: "Response activities are coordinated with internal and external stakeholders (e.g. external support from law enforcement agencies)",
        subcategories: [
          {
            id: "RS.CO-3",
            title: "Information is shared consistent with response plans",
            description: "Information is shared consistent with response plans",
            requirements: [
              {
                id: "RS.CO-3.1",
                title: "Share incident information",
                description: "Information/cybersecurity incident information shall be communicated and shared with the organization's employees in a format that they can understand",
                cyfunLevel: "basic",
                subcategoryId: "RS.CO-3",
                isKeyMeasure: false,
                guidance: [
                  "There are no additional guidelines."
                ],
                references: [
                  { name: "ISO 27001", clause: "A.16.1.2" },
                  { name: "NIST SP 800-53", clause: "IR-4" }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "RS.IM",
        name: "Improvements",
        description: "Organizational response activities are improved by incorporating lessons learned from current and previous detection/response activities",
        subcategories: [
          {
            id: "RS.IM-1",
            title: "Response and Recovery plans incorporate lessons learned",
            description: "Response and Recovery plans incorporate lessons learned",
            requirements: [
              {
                id: "RS.IM-1.1",
                title: "Post-incident evaluation",
                description: "The organization shall conduct post-incident evaluations to analyze lessons learned from incident response and recovery, and consequently improve processes / procedures / technologies to enhance its cyber resilience",
                cyfunLevel: "basic",
                subcategoryId: "RS.IM-1",
                isKeyMeasure: false,
                guidance: [
                  "Consider bringing involved people together after each incident and reflect together on ways to improve what happened, how it happened, how we reacted, how it could have gone better, what should be done to prevent it from happening again, etc."
                ],
                references: [
                  { name: "ISO 27001", clause: "A.16.1.6" },
                  { name: "NIST SP 800-53", clause: "IR-4" }
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
    description: "Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity incident",
    categories: [
      {
        id: "RC.RP",
        name: "Recovery Planning",
        description: "Recovery processes and procedures are executed and maintained to ensure restoration of systems or assets affected by cybersecurity incidents",
        subcategories: [
          {
            id: "RC.RP-1",
            title: "Recovery plan is executed",
            description: "Recovery plan is executed during or after a cybersecurity incident",
            requirements: [
              {
                id: "RC.RP-1.1",
                title: "Recovery process implementation",
                description: "A recovery process for disasters and information/cybersecurity incidents shall be developed and executed as appropriate",
                cyfunLevel: "basic",
                subcategoryId: "RC.RP-1",
                isKeyMeasure: false,
                guidance: [
                  "A process should be developed for what immediate actions will be taken in case of a fire, medical emergency, burglary, natural disaster, or an information/cybersecurity incident",
                  "This process should consider:",
                  "Roles and Responsibilities, including who makes the decision to initiate recovery procedures and who will be the contact with appropriate external stakeholders",
                  "What to do with company's information and information systems in case of an incident",
                  "This includes shutting down or locking computers, moving to a backup site, physically removing important documents, etc",
                  "Who to call in case of an incident"
                ],
                references: [
                  { name: "ISO 27001", clause: "A.17.1.2" },
                  { name: "NIST SP 800-53", clause: "CP-10" }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
];