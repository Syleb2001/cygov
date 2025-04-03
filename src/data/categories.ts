import { Category } from '../types';

export const categories: Category[] = [
  {
    name: 'IDENTIFY',
    description: 'The data, personnel, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization\'s risk strategy.',
    controls: [
      {
        id: 'ID.AM-1',
        title: 'Physical devices and systems inventory',
        description: 'Physical devices and systems used within the organization are inventoried.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'This inventory includes fixed and portable computers, tablets, mobile phones, Programmable Logic Controllers (PLCs), sensors, actuators, robots, machine tools, firmware, network switches, routers, power supplies, and other networked components or devices.',
          'This inventory must include all assets, whether or not they are connected to the organization\'s network.',
          'The use of an IT asset management tool could be considered.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 1' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.3.4' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 7.8' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.5, 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.9, 5.11, 7.9, 8.1' }
        ]
      },
      {
        id: 'ID.AM-2',
        title: 'Software platforms and applications inventory',
        description: 'Software platforms and applications used within the organization are inventoried.',
        cyfunLevel: 'basic',
        guidance: [
          'This inventory includes software programs, software platforms and databases, even if outsourced (SaaS).',
          'Outsourcing arrangements should be part of the contractual agreements with the provider.',
          'Information in the inventory should include for example: name, description, version, number of users, data processed, etc.',
          'A distinction should be made between unsupported software and unauthorized software.',
          'The use of an IT asset management tool could be considered.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 2' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.3.4' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 7.8' },
          { name: 'ISO/IEC 27001:2022', clause: 'Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.9' }
        ]
      },
      {
        id: 'ID.AM-3',
        title: 'Organizational communication and data flows mapping',
        description: 'Organizational communication and data flows are mapped.',
        cyfunLevel: 'basic',
        guidance: [
          'Start by listing all the types of information your business stores or uses. Define "information type" in any useful way that makes sense to your business.',
          'You may want to have your employees make a list of all the information they use in their regular activities.',
          'List everything you can think of, but you do not need to be too specific. For example, you may keep customer names and email addresses, receipts for raw material, your banking information, or other proprietary information.',
          'Consider mapping this information with the associated assets identified in the inventories of physical devices, systems, software platforms and applications used within the organization (see ID.AM-1 & ID.AM-2).'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 12' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.3.4' },
          { name: 'ISO/IEC 27001:2022', clause: 'Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.14' }
        ]
      },
      {
        id: 'ID.AM-4',
        title: 'External information systems catalogue',
        description: 'External information systems are catalogued.',
        cyfunLevel: 'basic',
        guidance: [
          'Outsourcing of systems, software platforms and applications used within the organization is covered in ID.AM-1 & ID.AM-2.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 12' },
          { name: 'ISO/IEC 27001:2022', clause: 'Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.12, 7.9' }
        ]
      },
      {
        id: 'ID.AM-5',
        title: 'Resource prioritization based on classification',
        description: 'Resources are prioritized based on their classification, criticality, and business value.',
        cyfunLevel: 'basic',
        guidance: [
          'Determine organization\'s resources (e.g., hardware, devices, data, time, personnel, information, and software):',
          'What would happen to my business if these resources were made public, damaged, lost...?',
          'What would happen to my business when the integrity of resources is no longer guaranteed?',
          'What would happen to my business if I/my customers couldn\'t access these resources? And rank these resources based on their classification, criticality, and business value.',
          'Resources should include enterprise assets.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 3' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.3.6' },
          { name: 'ISO/IEC 27001:2022', clause: 'Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.12, 7.9' }
        ]
      },
      {
        id: 'ID.AM-6',
        title: 'Cybersecurity roles, responsibilities, and authorities for the entire workforce and third-party stakeholders are established',
        description: 'Information security and cybersecurity roles, responsibilities, and authorities within the organization shall be documented, reviewed, authorized, and updated, aligned with internal roles and external partners.',
        cyfunLevel: 'important',
        guidance: [
          'Describe security roles, responsibilities, and authorities: determine who needs to be consulted, informed, and held accountable for each part of your assets.',
          'Assign security roles, responsibilities, and authority for all key functions in information/cybersecurity (legal, detection, etc.).',
          'Include information/cybersecurity roles and responsibilities for third-party providers (e.g., suppliers, customers, partners) with physical or logical access to the organization’s ICT/OT environment.'
        ],
        references: [
          { name: 'CIS Controls V8', clause: 'Critical Security Control 17' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.2.3.3' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 5.3, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.2, 5.4, 5.23, 5.24, 6.2, 6.5, 8.24' }
        ]
      },
      {
      id: 'ID.BE-1',
      title: 'The organization’s role in the supply chain is identified and communicated',
      description: 'The organization’s role in the supply chain shall be identified, documented, and communicated.',
      cyfunLevel: 'important',
      guidance: [
        'Clearly identify who is upstream and downstream in the supply chain and which suppliers provide services, capabilities, products, and items to the organization.',
        'Communicate this position to ensure upstream/downstream parties understand your organization’s role and its importance to business operations.'
      ],
      references: [
        { name: 'ISO/IEC 27001:2022', clause: 'Annex A (see ISO 27002)' },
        { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.19, 5.20, 5.21, 5.22' }
      ]
      },
      {
      id: 'ID.BE-2',
      title: 'The organization’s place in critical infrastructure and its industry sector is identified and communicated',
      description: 'The organization’s place in critical infrastructure and its industry sector shall be identified and communicated.',
      cyfunLevel: 'important',
      guidance: [
        'For organizations subject to NIS or similar legislation, identify peers within the same sector to work together toward sector-specific cybersecurity objectives.'
      ],
      references: [
        { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.2' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 4.1' }
      ]
      },
      {
      id: 'ID.BE-3',
      title: 'Priorities regarding organizational mission, objectives, and activities are established and communicated',
      description: 'Organizational mission, objectives, and activities are identified, established, and communicated. Information protection needs must be determined, and processes revised as appropriate.',
      cyfunLevel: 'important',
      guidance: [
        'Ensure alignment of cybersecurity objectives with mission-critical activities so that necessary protections are documented and understood.',
        'Communicate priorities internally so that each business unit knows its responsibilities regarding cyber risks.'
      ],
      references: [
        { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.2, 4.2.3.6' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 5.1, 5.2, 6.1, 7.4, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 5.1' }
      ]
      },
      {
      id: 'ID.BE-4',
      title: 'Dependencies and critical functions for delivery of critical services are established',
      description: 'Dependencies and mission-critical functions for the delivery of critical services shall be identified, documented, and prioritized according to their criticality as part of the risk assessment process.',
      cyfunLevel: 'important',
      guidance: [
        'Include support services in your identification of critical functions.',
        'Document each dependency in a clear manner so that if a dependency is disrupted, the potential effects on key processes are readily understood.'
      ],
      references: [
        { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.3.3' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.1, 8, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Controls 7.11, 7.12, 8.6' }
      ]
      },
      {
      id: 'ID.BE-5',
      title: 'Resilience requirements to support delivery of critical services are established for all operating states',
      description: 'To support cyber resilience and secure the delivery of critical services, the necessary requirements are identified, documented, tested, and approved.',
      cyfunLevel: 'important',
      guidance: [
        'Implement resiliency mechanisms to support normal and adverse operational situations (e.g., fail-safes, load balancing, hot swaps).',
        'Incorporate business continuity management through a Business Impact Analysis (BIA), Disaster Recovery Plan (DRP), and Business Continuity Plan (BCP).'
      ],
      references: [
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.29, 7.5, 8.14' }
      ]
      },
      {
        id: 'ID.GV-1',
        title: 'Organizational cybersecurity policy',
        description: 'Organizational cybersecurity policy is established and communicated.',
        cyfunLevel: 'basic',
        guidance: [
          'Policies and procedures used to identify acceptable practices and expectations for business operations, can be used to train new employees on your information security expectations, and can aid an investigation in case of an incident. These policies and procedures should be readily accessible to employees.',
          'Policies and procedures for information- and cybersecurity should clearly describe your expectations for protecting the organization\'s information and systems, and how management expects the company\'s resources to be used and protected by all employees.',
          'Policies and procedures should be reviewed and updated at least annually and every time there are changes in the organization or technology. Whenever the policies are changed, employees should be made aware of the changes.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 14' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.2.6' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 4, 5, 7.5, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.1' }
        ]
      },
      {
        id: 'ID.GV-3',
        title: 'Legal and regulatory requirements management',
        description: 'Legal and regulatory requirements regarding cybersecurity, including privacy and civil liberties obligations, are understood and managed.',
        cyfunLevel: 'basic',
        guidance: [
          'There are no additional guidelines.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.4.3.7' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 4.1, 4.2, 7.4, 7.2, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.31, 5.32, 5.33, 5.34' }
        ]
      },
      {
        id: 'ID.GV-4',
        title: 'Governance and risk management processes',
        description: 'Governance and risk management processes address cybersecurity risks.',
        cyfunLevel: 'basic',
        guidance: [
          'This strategy should include determining and allocating the required resources to protect the organization\'s business-critical assets.'
        ],
        references: [
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.3, 4.4.3.7' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 6' }
        ]
      },
      {
        id: 'ID.RA-1',
        title: 'Asset vulnerabilities identification',
        description: 'Asset vulnerabilities are identified and documented.',
        cyfunLevel: 'basic',
        guidance: [
          'A vulnerability refers to a weakness in the organization\'s hardware, software, or procedures. It is a gap through which a bad actor can gain access to the organization\'s assets. A vulnerability exposes an organization to threats.',
          'A threat is a malicious or negative event that takes advantage of a vulnerability.',
          'The risk is the potential for loss and damage when the threat does occur.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 7' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.3, 4.2.3.9, 4.2.3.12' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 6, 7, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.36, 8.8' }
        ]
      },
      {
      id: 'ID.RA-2',
      title: 'Cyber threat intelligence is received from information sharing forums and sources',
      description: 'A threat and vulnerability awareness program that includes cross-organization information-sharing capability shall be implemented.',
      cyfunLevel: 'important',
      guidance: [
        'Establish ongoing contact with security groups and associations for receiving security alerts and advisories (e.g., information sharing and analysis centers).',
        'Ensure the ability to share relevant threat data with partners when appropriate, including unclassified and classified methods, if applicable.'
      ],
      references: [
        { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 14' },
        { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.2.3, 4.2.3.9, 4.2.3.12' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 4.2, 7.4, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 5.6' }
      ]
      },
      
      {
        id: 'ID.RA-5',
        title: 'Risk determination process',
        description: 'Threats, vulnerabilities, likelihoods, and impacts are used to determine risk.',
        cyfunLevel: 'basic',
        guidance: [
          'Keep in mind that threats exploit vulnerabilities.',
          'Identify the consequences that losses of confidentiality, integrity and availability may have on the assets and related business processes.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 7, 10' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 5.1, 6.1, 7.4, A' }
        ]
      },
      {
      id: 'ID.RA-6',
      title: 'Risk responses are identified and prioritized',
      description: 'A comprehensive strategy to manage risks to the organization’s critical systems is developed, including identifying and prioritizing risk responses.',
      cyfunLevel: 'important',
      guidance: [
        'Involve both management and employees in cybersecurity risk management to ensure the highest-priority risks receive the attention and resources needed.',
        'Determine which assets are the most important and how they are protected, documenting the steps to address or accept each significant risk.'
      ],
      references: [
        { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 7, 10' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 5.1, 6.1.3, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 8.8' }
      ]
    },
    {
      id: 'ID.RM-1',
      title: 'Risk management processes are established, managed, and agreed to by organizational stakeholders',
      description: 'A cyber risk management process that identifies key internal and external stakeholders and facilitates addressing risk-related issues shall be created, documented, reviewed, approved, and updated when changes occur.',
      cyfunLevel: 'important',
      guidance: [
        'Ensure that external stakeholders (customers, investors, suppliers, government agencies) are considered in risk management decisions.',
        'Document how risk decisions are escalated, who must be involved, and how acceptance or mitigation is approved.'
      ],
      references: [
        { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 7, 10' },
        { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.2' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 5.1, 5.2, 6.1.3, 8.3, 9.3' }
      ]
    },
    {
      id: 'ID.RM-2',
      title: 'Organizational risk tolerance is determined and clearly expressed',
      description: 'The organization’s risk appetite is determined and clearly articulated, consistent with its cybersecurity and business objectives.',
      cyfunLevel: 'important',
      guidance: [
        'Express risk tolerance in a policy document to demonstrate alignment between cybersecurity policies, risk acceptance, and the measures in place.',
        'Ensure all relevant personnel (including management) know the acceptable level(s) of risk to support consistent decision-making.'
      ],
      references: [
        { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.2.6.5' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 5.1, 5.2, 6.1.3, 7.4, 8.3, 9.3' }
      ]
    },
    {
      id: 'ID.RM-3',
      title: 'The organization’s determination of risk tolerance is informed by its role in critical infrastructure and sector-specific risk analysis',
      description: 'The organization’s role in critical infrastructure and its sector shall inform how risk tolerance is determined.',
      cyfunLevel: 'important',
      guidance: [
        'If the organization is part of critical national infrastructure (CNI) or is in a regulated sector, ensure relevant sector requirements feed into the risk tolerance statement.',
        'Coordinate with relevant authorities or industry peers to align risk tolerance with any mandated or recommended sector-specific security standards.'
      ],
      references: [
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 5.1, 5.2, 6.1.3, 8.3, 9.3' }
      ]
    },
    {
      id: 'ID.SC-2',
      title: 'Suppliers and third-party partners of information systems, components, and services are identified, prioritized, and assessed using a cyber supply chain risk assessment process',
      description: 'The organization shall conduct cyber supply chain risk assessments at least annually or whenever a change to the organization’s critical systems, operational environment, or supply chain occurs.',
      cyfunLevel: 'important',
      guidance: [
        'Identify and prioritize potential negative impacts from distributed and interconnected ICT/OT products and service supply chains.',
        'Document results and share them with relevant internal stakeholders (e.g., procurement, IT, risk management).'
      ],
      references: [
        { name: 'IEC 62443-2-1:2010', clause: 'See 4.2.3.1 through 4.2.3.14' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 5.1, 5.3, 8.1, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.19, 5.20, 5.21, 5.22' }
      ]
    },
    {
      id: 'ID.SC-3',
      title: 'Contracts with suppliers and third-party partners are used to implement appropriate measures designed to meet the objectives of an organization’s cybersecurity program and Cyber Supply Chain Risk Management Plan',
      description: 'A contractual framework for suppliers and external partners shall be established, based on the results of the cyber supply chain risk assessment.',
      cyfunLevel: 'important',
      guidance: [
        'Ensure that security measures, confidentiality, and incident reporting obligations are included in all relevant supplier/third-party contracts.',
        'Include requirements for compliance with relevant regulations (e.g. GDPR) if personal data or sensitive business data is handled.'
      ],
      references: [
        { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.2.6.4, 4.3.2.6.7' },
        { name: 'IEC 62443-3-3:2013', clause: 'SR 6.1' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 6, 8.1, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.19, 5.20, 5.21, 5.22' }
      ]
    },
    {
      id: 'ID.SC-4',
      title: 'Suppliers and third-party partners are routinely assessed using audits, test results, or other forms of evaluations to confirm they are meeting their contractual obligations',
      description: 'The organization shall review suppliers’ and partners’ compliance by regularly examining audits, test results, and other evaluations.',
      cyfunLevel: 'important',
      guidance: [
        'Focus these assessments on business-critical suppliers and partners if full coverage is not feasible.',
        'Record and track nonconformities or security gaps found during audits, and follow up with remediation actions.'
      ],
      references: [
        { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.2.6.7' },
        { name: 'IEC 62443-3-3:2013', clause: 'SR 6.1' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, 9.2, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 5.22' }
      ]
    },
    {
      id: 'ID.SC-5',
      title: 'Response and recovery planning and testing are conducted with suppliers and third-party providers',
      description: 'Key suppliers and third-party partners are identified as stakeholders in response and recovery planning and shall be included in relevant testing activities.',
      cyfunLevel: 'important',
      guidance: [
        'Focus on business-critical third-party providers for joint response and recovery simulations.',
        'Establish lines of communication so that providers know who to contact in your organization during an incident, and vice versa.'
      ],
      references: [
        { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 18' },
        { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.2.5.7, 4.3.4.5.11' },
        { name: 'IEC 62443-3-3:2013', clause: 'SR 2.8, SR 3.3, SR 6.1, SR 7.3, SR 7.4' },
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 6.1.3, 8.1, 8.3, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 5.29' }
      ]
    }
    ]
  },
  {
    name: 'PROTECT',
    description: 'Access to physical and logical assets and associated facilities is limited to authorized users, processes, and devices, and is managed consistent with the assessed risk of unauthorized access to authorized activities and transactions.',
    controls: [
      {
        id: 'PR.AC-1',
        title: 'Identity and credentials management',
        description: 'Identities and credentials are issued, managed, verified, revoked, and audited for authorized devices, users, and processes.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'Change all default passwords.',
          'Ensure that no one works with administrator privileges for daily tasks.',
          'Keep a limited and updated list of system administrator accounts.',
          'Enforce password rules, e.g. passwords must be longer than a state-of-the-art number of characters with a combination of character types and changed periodically or when there is any suspicion of compromise.',
          'Use only individual accounts and never share passwords.',
          'Immediately disable unused accounts',
          'Rights and privileges are managed by user groups.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 1, 3, 4, 5, 12, 13' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.5.1, 4.3.3.7.4' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 1.1, SR 1.2, SR 1.3, SR 1.4, SR 1.5, SR 1.7, SR 1.8, SR 1.9' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.16, 5.17, 5.18, 8.2, 8.5' }
        ]
      },
      {
        id: 'PR.AC-2',
        title: 'Physical access management',
        description: 'Physical access to assets is managed and protected.',
        cyfunLevel: 'basic',
        guidance: [
          'Consider to strictly manage keys to access the premises and alarm codes. The following rules should be considered:',
          'Always retrieve an employee\'s keys or badges when they leave the company permanently.',
          'Change company alarm codes frequently.',
          'Never give keys or alarm codes to external service providers (cleaning agents, etc.), unless it is possible to trace these accesses and restrict them technically to given time slots.',
          'Consider to not leaving internal network access outlets accessible in public areas. These public places can be waiting rooms, corridors...'
        ],
        references: [
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.3.2, 4.3.3.3.8' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 7.1, 7.2, 7.3, 7.5, 7.6, 7.8, 7.9, 7.10, 7.12, 7.14, 8.1' }
        ]
      },
      {
        id: 'PR.AC-3',
        title: 'Remote access management',
        description: 'Remote access is managed.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'Consider the following when wireless networking is used:',
          'Change the administrative password upon installation of a wireless access points.',
          'Set the wireless access point so that it does not broadcast its Service Set Identifier (SSID).',
          'Set your router to use at least WiFi Protected Access (WPA-2 or WPA-3 where possible), with the Advanced Encryption Standard (AES) for encryption.',
          'Ensure that wireless internet access to customers is separated from your business network.',
          'Connecting to unknown or unsecured / guest wireless access points, should be avoided, and if unavoidable done through an encrypted virtual private network (VPN) capability.',
          'Manage all endpoint devices (fixed and mobile) according to the organization\'s security policies.',
          'Enforce MFA (e.g. 2FA) on Internet-facing systems, such as email, remote desktop, and Virtual Private Network (VPNs).'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 5, 6, 13' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.6.6, 4.3.3.7.4' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 1.1, SR 1.13, SR 2.6' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.14, 6.7, 7.9, 8.1, 8.5, 8.20' }
        ]
      },
      {
        id: 'PR.AC-4',
        title: 'Access permissions and authorizations',
        description: 'Access permissions and authorizations are managed, incorporating the principles of least privilege and separation of duties.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'Draw up and review regularly access lists per system (files, servers, software, databases, etc.), possibly through analysis of the Active Directory in Windows-based systems, with the objective of determining who needs what kind of access (privileged or not), to what, to perform their duties in the organization.',
          'Set up a separate account for each user (including any contractors needing access) and require that strong, unique passwords be used for each account.',
          'Ensure that all employees use computer accounts without administrative privileges to perform typical work functions. This includes separation of personal and admin accounts.',
          'For guest accounts, consider using the minimal privileges (e.g. internet access only) as required for your business needs.',
          'Permission management should be documented in a procedure and updated when appropriate.',
          'Use \'Single Sign On\' (SSO) when appropriate.',
          'Not allow any employee to have access to all the business\'s information.',
          'Limit the number of Internet accesses and interconnections with partner networks to the strict necessary to be able to centralize and homogenize the monitoring of exchanges more easily.',
          'Ensure that when an employee leaves the business, all access to the business\'s information or systems is blocked instantly.',
          'Separate administrator accounts from user accounts.',
          'Do not privilege user accounts to effectuate administration tasks.',
          'Create unique local administrator passwords and disable unused accounts.',
          'Consider prohibiting Internet browsing from administrative accounts.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 3, 4, 6, 7, 12, 13, 16' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.7.3' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 2.1' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.3, 5.15, 8.2, 8.3, 8.4, 8.18' }
        ]
      },
      {
        id: 'PR.AC-5',
        title: 'Network integrity protection',
        description: 'Network integrity is protected, incorporating network segregation where appropriate.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'Install and operate a firewall between your internal network and the Internet. This may be a function of a (wireless) access point/router, or it may be a function of a router provided by the Internet Service Provider (ISP).',
          'Ensure there is antivirus software installed on purchased firewall solutions and ensure that the administrator\'s log-in and administrative password is changed upon installation and regularly thereafter.',
          'Install, use, and update a software firewall on each computer system (including smart phones and other networked devices).',
          'Have firewalls on each of your computers and networks even if you use a cloud service provider or a virtual private network (VPN). Ensure that for telework home network and systems have hardware and software firewalls installed, operational, and regularly updated.',
          'Consider installing an Intrusion Detection / Prevention System (IDPS). These devices analyze network traffic at a more detailed level and can provide a greater level of protection.',
          'Consider creating different security zones in the network (e.g. Basic network segmentation through VLAN\'s or other network access control mechanisms) and control/monitor the traffic between these zones.',
          'When the network is "flat", the compromise of a vital network component can lead to the compromise of the entire network.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 3, 4, 7, 12, 16' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.4' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 3.1, SR 3.8' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.14, 8.20, 8.22, 8.26' }
        ]
      },
      {
      id: 'PR.AC-6',
      title: 'Identities are proofed and bound to credentials and asserted in interactions',
      description: 'Identities are established, proofed, and bound to credentials prior to being granted access to organizational resources.',
      cyfunLevel: 'important',
      guidance: [
        'Verify the identity of all users before granting access to systems or information.',
        'Bind identities to credentials using secure and verifiable methods (e.g., multifactor authentication, biometric validation).',
        'Ensure that identity assertions are logged and traceable during system interactions.'
      ],
      references: [
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 5.17, 5.18, 8.2' }
      ]
      },
      {
  id: 'PR.AC-7',
  title: 'Identities are proofed, bound to credentials, and asserted in interactions',
  description: 'Identities are verified and securely associated with credentials, and those credentials are used to assert identity during system interactions.',
  cyfunLevel: 'important',
  guidance: [
    'Perform identity proofing using trusted sources before issuing credentials.',
    'Ensure that credentials are strongly bound to the user identity (e.g., through multi-factor authentication).',
    'Ensure that identity assertions are securely transmitted and verifiable across sessions.',
    'Implement session monitoring and logging to detect any anomalous identity-related behavior.'
  ],
  references: [
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.16, 5.17, 5.18, 8.2' }
  ]
      },
      {
        id: 'PR.AT-1',
        title: 'User training and awareness',
        description: 'All users are informed and trained.',
        cyfunLevel: 'basic',
        guidance: [
          'Employees include all users and managers of the ICT/OT systems, and they should be trained immediately when hired and regularly thereafter about the company\'s information security policies and what they will be expected to do to protect company\'s business information and technology.',
          'Training should be continually updated and reinforced by awareness campaigns.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 14, 16' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.2.4.2' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.2, 7.4, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 6.3, 8.7' }
        ]
      },
      {
      id: 'PR.AT-2',
      title: 'Privileged users understand their roles and responsibilities',
      description: 'Personnel with privileged access rights (e.g., administrators) are trained on their responsibilities and security best practices.',
      cyfunLevel: 'important',
      guidance: [
        'Provide targeted cybersecurity training to privileged users upon onboarding and at regular intervals.',
        'Ensure privileged users understand separation of duties, access restrictions, and logging requirements.',
        'Reinforce secure configuration and change control principles.'
      ],
      references: [
        { name: 'CIS Controls V8', clause: 'Control 14' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 6.3, 8.7' }
      ]
    },
    {
      id: 'PR.AT-3',
      title: 'Third-party stakeholders understand their roles and responsibilities',
      description: 'Third-party actors are made aware of and acknowledge their responsibilities in safeguarding the organization’s information and systems.',
      cyfunLevel: 'important',
      guidance: [
        'Incorporate security expectations and policies in third-party contracts and onboarding documentation.',
        'Ensure that suppliers and partners understand their role in protecting organizational assets.',
        'Track acknowledgement and completion of training or awareness activities.'
      ],
      references: [
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 5.21, 5.22, 6.3' }
      ]
    },
    {
      id: 'PR.AT-4',
      title: 'Senior executives understand their roles and responsibilities',
      description: 'Executives and senior management are aware of their responsibilities in ensuring a cybersecurity culture and in allocating appropriate resources.',
      cyfunLevel: 'important',
      guidance: [
        'Include cybersecurity in leadership-level meetings and decisions.',
        'Provide cybersecurity briefings tailored to executive roles.',
        'Ensure executives approve and understand major security initiatives and risk decisions.'
      ],
      references: [
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 5.1, 5.3, 7.4' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 5.2, 6.2' }
      ]
    },
    {
      id: 'PR.AT-5',
      title: 'Physical and cybersecurity personnel understand their roles and responsibilities',
      description: 'Personnel responsible for the protection of physical assets and information systems are trained on integrated security concepts.',
      cyfunLevel: 'important',
      guidance: [
        'Ensure coordination between physical security and cybersecurity teams.',
        'Train personnel on how physical and logical threats intersect.',
        'Conduct joint exercises where appropriate to test response procedures.'
      ],
      references: [
        { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.2, 7.3, Annex A' },
        { name: 'ISO/IEC 27002:2022', clause: 'Control 6.3, 7.5, 8.7' }
      ]
      },
      {
        id: 'PR.DS-1',
        title: 'Data-at-rest protection',
        description: 'Data-at-rest is protected.',
        cyfunLevel: 'basic',
        guidance: [
          'Consider using encryption techniques for data storage, data transmission or data transport (e.g., laptop, USB).',
          'Consider encrypting end-user devices and removable media containing sensitive data (e.g. hard disks, laptops, mobile device, USB storage devices, …). This could be done by e.g. Windows BitLocker®, VeraCrypt, Apple FileVault®, Linux® dm-crypt,…',
          'Consider encrypting sensitive data stored in the cloud.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 3' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 3.4, SR 4.1' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.10' }
        ]
      },
      {
        id: 'PR.DS-2',
        title: 'Data-in-transit protection',
        description: 'Data-in-transit is protected.',
        cyfunLevel: 'basic',
        guidance: [
          'When the organization often sends sensitive documents or e-mails, it is recommended to encrypt those documents and/or e-mails with appropriate, supported, and authorized software tools.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 3' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 3.1, SR 3.8, SR 4.1, SR 4.2' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 8, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.10, 5.14, 8.20, 8.26' }
        ]
      },
      {
        id: 'PR.DS-3',
        title: 'Asset management throughout lifecycle',
        description: 'Assets are formally managed throughout removal, transfers, and disposition.',
        cyfunLevel: 'basic',
        guidance: [
          'When eliminating tangible assets like business computers/laptops, servers, hard drive(s) and other storage media (USB drives, paper…), ensure that all sensitive business or personal data are securely deleted (i.e. electronically "wiped") before they are removed and then physically destroyed (or re-commissioned). This is also known as "sanitization" and thus related to the requirement and guidance in PR.IP-6.',
          'Consider installing a remote-wiping application on company laptops, tablets, cell phones, and other mobile devices.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 1' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.3.9, 4.3.4.4.1' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 4.2' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.5, 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.10, 7.10, 7.14' }
        ]
      },
      {
  id: 'PR.DS-4',
  title: 'Adequate capacity to ensure availability is maintained',
  description: 'Resources such as processing power, network bandwidth, and storage are planned and provisioned to ensure continued availability.',
  cyfunLevel: 'important',
  guidance: [
    'Monitor system load to anticipate capacity issues.',
    'Include capacity planning in IT and OT procurement.',
    'Define thresholds and alerting mechanisms for critical resource consumption.'
  ],
  references: [
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 8.26' }
  ]
},
{
  id: 'PR.DS-5',
  title: 'Protections against data leaks are implemented',
  description: 'Controls are in place to prevent unauthorized information disclosure, such as via Data Loss Prevention (DLP) technologies or strict access controls.',
  cyfunLevel: 'important',
  guidance: [
    'Apply DLP solutions to monitor and block unauthorized transmission of sensitive data.',
    'Enforce encryption of confidential information at rest and in transit.',
    'Conduct regular audits on data access rights and monitor data exfiltration vectors.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 3' },
    { name: 'IEC 62443-3-3:2013', clause: 'SR 5.2' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.3, 5.10, 6.1, 6.2, 6.5, 7.5, 8.2, 8.3, 8.4, 8.18, 8.20, 8.22' }
  ]
},
{
  id: 'PR.DS-6',
  title: 'Integrity checking mechanisms are used to verify software, firmware, and information integrity',
  description: 'Technologies such as file hashing and digital signatures are used to verify the integrity of data and code.',
  cyfunLevel: 'important',
  guidance: [
    'Implement file integrity monitoring (FIM) on critical systems.',
    'Verify firmware updates and software installations using trusted signatures.',
    'Detect unauthorized changes by comparing hashes to known-good baselines.'
  ],
  references: [
    { name: 'IEC 62443-3-3:2013', clause: 'SR 3.3, SR 4.1' },
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.10, 8.20, 8.26' }
  ]
},
      {
        id: 'PR.DS-7',
        title: 'Development and testing environment separation',
        description: 'The development and testing environment(s) are separate from the production environment.',
        cyfunLevel: 'basic',
        guidance: [
          'Any change one wants to make to the ICT/OT environment should first be tested in an environment that is different and separate from the production environment (operational environment) before that change is effectively implemented. That way, the effect of those changes can be analysed and adjustments can be made without disrupting operational activities.',
          'Consider adding and testing cybersecurity features as early as during development (secure development lifecycle principles).'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 16' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 8.31' }
        ]
      },
      {
  id: 'PR.IP-1',
  title: 'A baseline configuration of information technology/industrial control systems is created and maintained incorporating security principles',
  description: 'Baseline configurations are established and maintained for IT/OT systems, including security settings, operating systems, applications, and network configurations.',
  isKeyMeasure: true,
  cyfunLevel: 'important',
  guidance: [
    'Define standard secure configurations for all system types (servers, endpoints, PLCs, etc.).',
    'Review and update configurations periodically, particularly after major changes.',
    'Use automated configuration management tools to enforce baseline consistency.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 4' },
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 8.9, 8.10, 8.11' }
  ]
},
{
  id: 'PR.IP-2',
  title: 'A System Development Life Cycle to manage systems is implemented',
  description: 'A secure SDLC process is established and implemented to ensure that cybersecurity is addressed throughout the system lifecycle.',
  cyfunLevel: 'important',
  guidance: [
    'Define security requirements as part of design and development.',
    'Ensure that system changes are evaluated and tested prior to deployment.',
    'Incorporate security reviews and approvals into each development phase.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 16' },
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 8.25, 8.28, 8.31' }
  ]
},
{
  id: 'PR.IP-3',
  title: 'Configuration change control processes are in place',
  description: 'Changes to organizational systems are managed through a documented and controlled process that includes security reviews and approvals.',
  cyfunLevel: 'important',
  guidance: [
    'Use formal change management processes to evaluate, approve, and track system changes.',
    'Assess security impact of proposed changes before implementation.',
    'Ensure rollback plans exist in case changes introduce unexpected behavior.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 4, 16' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 8.32' }
  ]
},
      {
        id: 'PR.IP-4',
        title: 'Information backup management',
        description: 'Backups of information are conducted, maintained, and tested.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'Organization\'s business critical system\'s data includes for example software, configurations and settings, documentation, system configuration data including computer configuration backups, application configuration backups, etc.',
          'Consider a regular backup and put it offline periodically.',
          'Recovery time and recovery point objectives should be considered.',
          'Consider not storing the organization\'s data backup on the same network as the system on which the original data resides and provide an offline copy. Among other things, this prevents file encryption by hackers (risk of ransomware).'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 11' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.3.9' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 7.3, SR 7.4' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.5, 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.29, 5.33, 8.13' }
        ]
      },
      {
  id: 'PR.IP-5',
  title: 'Policy and regulations regarding the physical operating environment for organizational assets are met',
  description: 'Organizational facilities and physical environments are managed in accordance with applicable policies and regulations to ensure asset protection.',
  cyfunLevel: 'important',
  guidance: [
    'Implement environmental controls such as fire suppression, HVAC, and water detection.',
    'Restrict physical access to areas housing critical systems.',
    'Ensure compliance with applicable local, national, and sector-specific standards.'
  ],
  references: [
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 7.1, 7.2, 7.3, 7.4' }
  ]
},
{
  id: 'PR.IP-6',
  title: 'Data is destroyed according to policy',
  description: 'Data is securely destroyed when no longer needed, in accordance with the organization’s data retention and disposal policy.',
  cyfunLevel: 'important',
  guidance: [
    'Use secure erasure methods for data on electronic media (e.g., shredding, degaussing, wiping).',
    'Maintain records of media destruction activities.',
    'Ensure that destruction policies apply to both digital and physical data.'
  ],
  references: [
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 7.10, 7.14' }
  ]
},
{
  id: 'PR.IP-7',
  title: 'Protection processes are improved',
  description: 'The organization reviews and enhances protection mechanisms to adapt to emerging threats and lessons learned.',
  cyfunLevel: 'important',
  guidance: [
    'Conduct regular reviews of protective controls’ effectiveness.',
    'Implement corrective actions based on incident reports, audit results, and new threat intelligence.',
    'Track improvement initiatives and assign accountability.'
  ],
  references: [
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.6, 8.1' }
  ]
},
{
  id: 'PR.IP-8',
  title: 'Effectiveness of protection technologies is shared',
  description: 'Information about the performance and effectiveness of protective technologies is shared with appropriate stakeholders.',
  cyfunLevel: 'important',
  guidance: [
    'Report KPIs and metrics related to protective controls to relevant internal teams.',
    'Share findings with vendors or community peers where appropriate, especially in collaborative defense settings.',
    'Maintain confidentiality while sharing non-sensitive insights externally.'
  ],
  references: [
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.6' }
  ]
},
{
  id: 'PR.IP-9',
  title: 'Response plans (Incident Response and Business Continuity) and recovery plans (Incident Recovery and Disaster Recovery) are in place and managed',
  description: 'Plans and procedures for incident response, business continuity, and disaster recovery are established, maintained, and reviewed regularly.',
  cyfunLevel: 'important',
  guidance: [
    'Establish documented response and recovery plans aligned with business needs.',
    'Test and update these plans periodically.',
    'Assign clear roles and responsibilities for plan execution.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Controls 11, 17, 18' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 6, 8.3, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.29, 5.30, 5.31' }
  ]
},
      {
        id: 'PR.IP-11',
        title: 'Cybersecurity in HR practices',
        description: 'Cybersecurity is included in human resources practices (deprovisioning, personnel screening…).',
        cyfunLevel: 'basic',
        guidance: [
          'The access to critical information or technology should be considered when recruiting, during employment and at termination.',
          'Background verification checks should take into consideration applicable laws, regulations, and ethics in proportion to the business requirements, the classification of the information to be accessed and the perceived risks.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 4, 6' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.2.1, 4.3.3.2.2, 4.3.3.2.3' }
        ]
      },
      {
  id: 'PR.IP-12',
  title: 'A vulnerability management plan is developed and implemented',
  description: 'A formalized vulnerability management process is established to identify, evaluate, and remediate system weaknesses.',
  cyfunLevel: 'important',
  guidance: [
    'Maintain an up-to-date inventory of assets and associated vulnerabilities.',
    'Prioritize remediation based on criticality, exploitability, and potential impact.',
    'Use automated tools to regularly scan systems for known vulnerabilities.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 7' },
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 8.8, 8.28' }
  ]
},
      {
        id: 'PR.MA-1',
        title: 'Asset maintenance and repair',
        description: 'Maintenance and repair of organizational assets are performed and logged, with approved and controlled tools.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'Limit yourself to only install those applications (operating systems, firmware, or plugins ) that you need to run your business and patch/update them regularly.',
          'You should only install a current and vendor-supported version of software you choose to use. It may be useful to assign a day each month to check for patches.',
          'There are products which can scan your system and notify you when there is an update for an application you have installed. If you use one of these products, make sure it checks for updates for every application you use.',
          'Install patches and security updates in a timely manner.'
        ],
        references: [
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.3.7' },
          { name: 'ISO/IEC 27001:2022', clause: '4.2, 7.1, 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 7.2, 7.9, 7.10, 7.13' }
        ]
      },
      {
  id: 'PR.MA-2',
  title: 'Remote maintenance of organizational assets is approved, logged, and performed in a manner that prevents unauthorized access',
  description: 'Remote maintenance activities must be explicitly authorized, monitored, and protected against unauthorized access.',
  cyfunLevel: 'important',
  guidance: [
    'Define approved remote maintenance methods and document procedures.',
    'Log all remote connections and review logs regularly.',
    'Apply multi-factor authentication and encryption to all remote sessions.'
  ],
  references: [
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.4.5' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 8.6, 8.7' }
  ]
},
      {
        id: 'PR.PT-1',
        title: 'Audit/log records management',
        description: 'Audit/log records are determined, documented, implemented, and reviewed in accordance with policy.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'Ensure the activity logging functionality of protection / detection hardware or software (e.g. firewalls, anti-virus) is enabled.',
          'Logs should be backed up and saved for a predefined period.',
          'The logs should be reviewed for any unusual or unwanted trends, such as a large use of social media websites or an unusual number of viruses consistently found on a particular computer. These trends may indicate a more serious problem or signal the need for stronger protections in a particular area.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 1, 3, 4, 8' },
          { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.3.3.9, 4.3.3.5.8, 4.3.4.4.7, 4.4.2.1, 4.4.2.4' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 2.8, SR 2.9, SR 2.10, SR 2.11, SR 2.12' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 9.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 8.15, 8.17, 8.34' }
        ]
      },
      {
  id: 'PR.PT-2',
  title: 'Removable media is protected and its use restricted according to policy',
  description: 'Removable media usage (USB, CDs, external drives) is restricted and managed to prevent data loss or introduction of malware.',
  cyfunLevel: 'important',
  guidance: [
    'Disable ports when not in use or apply whitelisting policies.',
    'Scan all removable media automatically before use.',
    'Encrypt sensitive data stored on removable devices.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 4' },
    { name: 'ISO/IEC 27002:2022', clause: 'Controls 5.10, 7.9, 7.14' }
  ]
},
{
  id: 'PR.PT-3',
  title: 'The principle of least functionality is incorporated by configuring systems to provide only essential capabilities',
  description: 'Systems are hardened to disable non-essential functions, ports, and services to reduce their attack surface.',
  cyfunLevel: 'important',
  guidance: [
    'Disable unused services, protocols, and accounts.',
    'Regularly review baseline configurations for drift.',
    'Apply hardening guides (e.g., CIS Benchmarks) during setup.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 4, 10' },
    { name: 'ISO/IEC 27001:2022', clause: 'Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 8.6' }
  ]
},
      {
        id: 'PR.PT-4',
        title: 'Communications and control networks protection',
        description: 'Communications and control networks are protected.',
        cyfunLevel: 'basic',
        guidance: [
          'E-mail filters should detect malicious e-mails, and filtering should be configured based on the type of message attachments so that files of the specified types are automatically processed (e.g. deleted).',
          'Web-filters should notify the user if a website may contain malware and potentially preventing users from accessing that website.'
        ],
        references: [
          { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 4, 10, 12, 13' },
          { name: 'IEC 62443-3-3:2013', clause: 'SR 3.1, SR 3.5, SR 3.8, SR 4.1, SR 4.3, SR 5.1, SR 5.2, SR 5.3, SR 7.1, SR 7.6' },
          { name: 'ISO/IEC 27001:2022', clause: 'Clause 4.1, 8.1, Annex A' },
          { name: 'ISO/IEC 27002:2022', clause: 'Control 5.14, 8.20, 8.2' }
        ]
      }
    ]
  },
  {
    name: 'DETECT',
    description: 'Anomalous events are detected and the potential impact of events is understood.',
    controls: [
      {
  id: 'DE.AE-2',
  title: 'Detected events are analysed to understand attack targets and methods',
  description: 'The organization analyses detected events to identify potential attack vectors and targets.',
  cyfunLevel: 'important',
  guidance: [],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 1, 8, 13, 15' },
    { name: 'IEC 62443-2-1:2010', clause: '4.3.4.5.6, 4.3.4.5.7, 4.3.4.5.8' },
    { name: 'IEC 62443-3-3:2013', clause: 'SR 2.8, SR 2.9, SR 2.10, SR 2.11, SR 2.12, SR 3.9, SR 6.1, SR 6.2' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, 9.1, 10.2, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.24, 5.25, 8.15' }
  ]
},
      {
        id: 'DE.AE-3',
        title: 'Event data collection and correlation',
        description: 'Event data are collected and correlated from multiple sources and sensors.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'Logs should be backed up and saved for a predefined period.',
          'The logs should be reviewed for any unusual or unwanted trends, such as a large use of social media websites or an unusual number of viruses consistently found on a particular computer. These trends may indicate a more serious problem or signal the need for stronger protections in a particular area.'
        ],
        references: [
          { name: 'CIS Controls V8', clause: 'Control 8, 13' },
          { name: 'ISO/IEC 27001:2022', clause: 'A.12.4' }
        ]
      },
      {
  id: 'DE.AE-5',
  title: 'Incident alert thresholds are established',
  description: 'Incident alert thresholds are defined and system alerts are configured to support detection and escalation.',
  cyfunLevel: 'important',
  guidance: [],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 8, 13' },
    { name: 'IEC 62443-2-1:2010', clause: '4.2.3.10' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 8.1, 9.1, 10.2, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.25' }
  ]
},
      {
        id: 'DE.CM-1',
        title: 'Network monitoring',
        description: 'The network is monitored to detect potential cybersecurity events.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          'Endpoints include desktops, laptops, servers...',
          'Consider, where feasible, including smart phones and other networked devices when installing and operating firewalls.',
          'Consider limiting the number of interconnection gateways to the Internet.'
        ],
        references: [
          { name: 'CIS Controls V8', clause: 'Control 8, 13' },
          { name: 'ISO/IEC 27001:2022', clause: 'A.12.4' }
        ]
      },
      {
  id: 'DE.CM-2',
  title: 'The physical environment is monitored to detect potential cybersecurity events',
  description: 'Physical areas hosting critical systems are monitored for unauthorized access or suspicious activity.',
  cyfunLevel: 'important',
  guidance: [],
  references: [
    { name: 'IEC 62443-2-1:2010', clause: '4.3.3.3.8' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.5, 8, 9.1, 9.2, 10, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.22, 7.1, 7.2, 8.15, 8.30' }
  ]
},
      {
        id: 'DE.CM-3',
        title: 'Personnel activity monitoring',
        description: 'Personnel activity is monitored to detect potential cybersecurity events.',
        cyfunLevel: 'basic',
        guidance: [
          'Consider deploying an Intrusion Detection/Prevention system (IDS/IPS).'
        ],
        references: [
          { name: 'CIS Controls V8', clause: 'Control 8, 13' },
          { name: 'ISO/IEC 27001:2022', clause: 'A.12.4' }
        ]
      },
      {
        id: 'DE.CM-4',
        title: 'Malicious code detection',
        description: 'Malicious code is detected.',
        isKeyMeasure: true,
        cyfunLevel: 'basic',
        guidance: [
          "Malware includes viruses, spyware, and ransomware and should be countered by installing, using, and regularly updating anti-virus and anti-spyware software on every device used in company's business (including computers, smart phones, tablets, and servers).",
          'Anti-virus and anti-spyware software should automatically check for updates in "real-time" or at least daily followed by system scanning as appropriate.',
          'It should be considered to provide the same malicious code protection mechanisms for home computers (e.g. teleworking) or personal devices that are used for professional work (BYOD)'
        ],
        references: [
          { name: 'CIS Controls V8', clause: 'Control 10' },
          { name: 'ISO/IEC 27001:2022', clause: 'A.12.2' }
        ]
      },
{
  id: 'DE.CM-5',
  title: 'Unauthorized mobile code is detected',
  description: 'Mobile code is controlled, authorized, and monitored to prevent unauthorized execution.',
  cyfunLevel: 'important',
  guidance: [
    'Mobile code includes code transmitted across networks (e.g., email attachments, web scripts).',
    'Define and enforce what types of mobile code are allowed.',
    'Apply restrictions to technologies like JavaScript, VBScript, Java applets, HTML5, etc.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 8, 10' },
    { name: 'IEC 62443-3-3:2013', clause: 'SR 2.4' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.5, 8, 9.1, 9.2, 10, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 8.19' }
  ]
},
{
  id: 'DE.CM-6',
  title: 'External service provider activity is monitored to detect potential cybersecurity events',
  description: 'Activity from external providers is monitored to detect unauthorized behavior and ensure compliance.',
  cyfunLevel: 'important',
  guidance: [
    'Monitor vendor remote access and enforce contractual obligations.',
    'Detect unauthorized connections and suspicious activity by third-party accounts.'
  ],
  references: [
    { name: 'IEC 62443-2-1:2010', clause: '4.3.3.3.8' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.5, 8, 9.1, 9.2, 10, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.22, 8.15, 8.30' }
  ]
},
{
  id: 'DE.CM-7',
  title: 'Monitoring for unauthorized personnel, connections, devices, and software is performed',
  description: 'Systems are monitored for unauthorized access, devices, software installations, and system changes.',
  cyfunLevel: 'important',
  guidance: [
    'Include physical, logical, and remote access attempts.',
    'Track changes in asset inventory and unauthorized configurations.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 1, 2, 8, 13, 15' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.1, 7.5, 8, 9.1, 9.2, 10, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.22, 8.15, 8.30' }
  ]
},
{
  id: 'DE.CM-8',
  title: 'Vulnerability scans are performed',
  description: 'Regular and continuous scanning is performed to identify vulnerabilities in critical systems.',
  cyfunLevel: 'important',
  guidance: [
    'Include scanning of hosted apps and infrastructure.',
    'Develop remediation plans and share relevant results with stakeholders.'
  ],
  references: [
    { name: 'CIS Controls V8', clause: 'Control 8, 10' },
    { name: 'IEC 62443-2-1:2010', clause: '4.2.3.1, 4.2.3.7' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 8, 9.1, 9.2, 10, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 8.8, 8.29' }
  ]
},
{
  id: 'DE.DP-2',
  title: 'Detection activities comply with all applicable requirements',
  description: 'Detection operations comply with laws, regulations, and organizational policies.',
  cyfunLevel: 'important',
  guidance: [],
  references: [
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.3, 7.4, 8.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.34, 5.36, 8.8' }
  ]
},
{
  id: 'DE.DP-3',
  title: 'Detection processes are tested',
  description: 'Detection systems and procedures are tested and validated regularly.',
  cyfunLevel: 'important',
  guidance: [
    'Ensure detection processes are working as intended.',
    'Testing should be demonstrable and documented.'
  ],
  references: [
    { name: 'IEC 62443-2-1:2010', clause: '4.4.3.2' },
    { name: 'IEC 62443-3-3:2013', clause: 'SR 3.3' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.3, 7.4, 8.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 8.29' }
  ]
},
{
  id: 'DE.DP-4',
  title: 'Event detection information is communicated',
  description: 'Detection data and alerts are communicated to designated stakeholders.',
  cyfunLevel: 'important',
  guidance: [
    'Communicate alerts on abnormal activity like unauthorized access, malware, remote access, and VoIP misuse.'
  ],
  references: [
    { name: 'IEC 62443-2-1:2010', clause: '4.3.4.5.9' },
    { name: 'IEC 62443-3-3:2013', clause: 'SR 6.1' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.3, 7.4, 8.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 6.8' }
  ]
},
{
  id: 'DE.DP-5',
  title: 'Detection processes are continuously improved',
  description: 'Detection processes are refined based on reviews, incidents, and emerging threats.',
  cyfunLevel: 'important',
  guidance: [
    'Use monitoring, testing, and lessons learned to update procedures.',
    'Consider using independent assessments for quality improvement.'
  ],
  references: [
    { name: 'IEC 62443-2-1:2010', clause: '4.4.3.4' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.3, 7.4, 8.1, 9, 10.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.27' }
  ]
}
    ]
  },
  {
    name: 'RESPOND',
    description: 'Response activities are executed and maintained, to ensure timely response to detected cybersecurity incidents.',
    controls: [
      {
        id: 'RS.RP-1',
        title: 'Response plan execution',
        description: 'Response plan is executed during or after an incident.',
        cyfunLevel: 'basic',
        guidance: [
          'The incident response process should include a predetermined set of instructions or procedures to detect, respond to, and limit consequences of a malicious cyber-attack.',
          'The roles, responsibilities, and authorities in the incident response plan should be specific on involved people, contact info, different roles and responsibilities, and who makes the decision to initiate recovery procedures as well as who will be the contact with appropriate external stakeholders.'
        ],
        references: [
          { name: 'CIS Controls V8', clause: 'Control 17' },
          { name: 'ISO/IEC 27001:2022', clause: 'A.16.1' }
        ]
      },
      {
  id: 'RS.CO-1',
  title: 'Personnel know their roles and order of operations when a response is needed',
  description: 'The organization shall ensure that personnel understand their roles, objectives, restoration priorities, task sequences (order of operations) and assignment responsibilities for event response.',
  cyfunLevel: 'important',
  guidance: [
    'Consider the use the CCB Incident Management Guide to guide you through this exercise and consider bringing in outside experts if needed.',
    'Test your plan regularly and adjust it after each incident.'
  ],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.2, 4.3.4.5.3, 4.3.4.5.4' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 5, 7.3, 7.4, 8.1, 8.3, 10, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.2, 5.24, 6.3' }
  ]
},
      {
  id: 'RS.CO-2',
  title: 'Incidents are reported consistent with established criteria',
  description: 'The organization shall implement reporting on information/cybersecurity incidents on its critical systems in an organization-defined time frame to organization-defined personnel or roles.',
  cyfunLevel: 'important',
  guidance: [
    'All users should have a single point of contact to report any incident and be encouraged to do so.'
  ],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.5' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 5, 7.3, 7.4, 8.1, 8.3, 10, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.5, 6.8' }
  ]
},
      {
        id: 'RS.CO-3',
        title: 'Information sharing',
        description: 'Information is shared consistent with response plans.',
        cyfunLevel: 'basic',
        guidance: [
          "Information/cybersecurity incident information shall be communicated and shared with the organization's employees in a format that they can understand."
        ],
        references: [
          { name: 'CIS Controls V8', clause: 'Control 17' },
          { name: 'ISO/IEC 27001:2022', clause: 'A.16.1' }
        ]
      },
      {
  id: 'RS.CO-4',
  title: 'Coordination with stakeholders occurs consistent with response plans',
  description: 'The organization shall coordinate information/cybersecurity incident response actions with all predefined stakeholders.',
  cyfunLevel: 'important',
  guidance: [
    'Stakeholders for incident response include for example, mission/business owners, organization\'s critical system owners, integrators, vendors, human resources offices, physical and personnel security offices, legal departments, operations personnel, and procurement offices.',
    'Coordination with stakeholders occurs consistent with incident response plans.'
  ],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.5' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.3, 7.4, 8.1, 8.3, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.6, 5.26' }
  ]
},
{
  id: 'RS.CO-5',
  title: 'Voluntary information sharing occurs with external stakeholders to achieve broader cybersecurity situational awareness',
  description: 'The organization shall share information/cybersecurity event information voluntarily, as appropriate, with external stakeholders, industry security groups… to achieve broader information/cybersecurity situational awareness.',
  cyfunLevel: 'important',
  guidance: [],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.3, 7.4, 8.1, 8.3, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.6' }
  ]
},
      {
  id: 'RS.AN-1',
  title: 'Notifications from detection systems are investigated',
  description: 'The organization shall investigate information/cybersecurity-related notifications generated from detection systems.',
  cyfunLevel: 'important',
  guidance: [],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.6, 4.3.4.5.7, 4.3.4.5.8' },
    { name: 'IEC 62443-3-3:2013', clause: 'SR 6.1' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 9.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.26, 8.15' }
  ]
},
{
  id: 'RS.AN-2',
  title: 'The impact of the incident is understood',
  description: 'Thorough investigation and result analysis shall be the base for understanding the full implication of the information/cybersecurity incident.',
  cyfunLevel: 'important',
  guidance: [
    'Result analysis can involve the outcome of determining the correlation between the information of the detected event and the outcome of risk assessments. In this way, insight is gained into the impact of the event across the organization.',
    'Consider including detection of unauthorized changes to its critical systems in its incident response capabilities.'
  ],
  references: [
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.6, 4.3.4.5.7, 4.3.4.5.8' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 4.1, 4.2, 9.1, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.25, 5.27' }
  ]
},
{
  id: 'RS.AN-4',
  title: 'Incidents are categorized consistent with response plans',
  description: 'Information/cybersecurity incidents shall be categorized according to the level of severity and impact consistent with the evaluation criteria included in the incident response plan.',
  cyfunLevel: 'important',
  guidance: [
    'It should be considered to determine the causes of an information/cybersecurity incident and implement a corrective action in order that the incident does not recur or occur elsewhere.',
    'The effectiveness of any corrective action taken should be reviewed.',
    'Corrective actions should be appropriate to the effects of the information/cybersecurity incident encountered.'
  ],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.6' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 6, 8.3, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.25' }
  ]
},
{
  id: 'RS.AN-5',
  title: 'Processes are established to receive, analyse, and respond to vulnerabilities disclosed to the organization from internal and external sources',
  description: 'The organization shall implement vulnerability management processes and procedures that include processing, analysing and remedying vulnerabilities from internal and external sources.',
  isKeyMeasure: true,
  cyfunLevel: 'important',
  guidance: [
    'Internal and external sources could be e.g. internal testing, security bulletins, or security researchers.'
  ],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 6, 7.5, 8.3, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 8.8' }
  ]
},
      {
  id: 'RS.MI-1',
  title: 'Incidents are contained',
  description: 'Activities are performed to prevent expansion of an event, mitigate its effects, and resolve the incident.',
  cyfunLevel: 'important',
  guidance: [],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.6' },
    { name: 'IEC 62443-3-3:2013', clause: 'SR 5.1, SR 5.2, SR 5.4' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 6, 7.5, 8.3, 10.2, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.26, 8.7, 8.8' }
  ]
},
{
  id: 'RS.MI-2',
  title: 'Incidents are mitigated',
  description: 'Activities are performed to prevent expansion of an event, mitigate its effects, and resolve the incident.',
  cyfunLevel: 'important',
  guidance: [],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.6' },
    { name: 'IEC 62443-3-3:2013', clause: 'SR 5.1, SR 5.2, SR 5.4' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 6, 7.5, 8.3, 10.2, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.26, 8.7, 8.8' }
  ]
},
{
  id: 'RS.MI-3',
  title: 'Newly identified vulnerabilities are mitigated or documented as accepted risks',
  description: 'The organization shall implement an incident handling capability for information/cybersecurity incidents on its business-critical systems that includes preparation, detection and analysis, containment, eradication, recovery, and documented risk acceptance.',
  cyfunLevel: 'important',
  guidance: [
    'A documented risk acceptance deals with risks that the organisation assesses as not dangerous to the organisation\'s business critical systems and where the risk owner formally accepts the risk (related with the risk appetite of the organization).'
  ],
  references: [
    { name: 'CIS Controls V8 (ETSI TR 103 305 1 V4.1.1)', clause: 'Critical Security Control 17' },
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.6' },
    { name: 'IEC 62443-3-3:2013', clause: 'SR 5.1, SR 5.2, SR 5.4' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 6, 7.5, 8.3, 10.2, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.26, 8.7, 8.8' }
  ]
},
      {
  id: 'RS.IM-1',
  title: 'Response plans incorporate lessons learned',
  description: 'The organization shall conduct post-incident evaluations to analyse lessons learned from incident response and recovery, and consequently improve processes/procedures/technologies to enhance its cyber resilience.',
  cyfunLevel: 'basic',
  guidance: [
    'Consider bringing involved people together after each incident and reflect together on ways to improve what happened, how it happened, how we reacted, how it could have gone better, what should be done to prevent it from happening again, etc.',
    'Lessons learned from incident handling shall be translated into updated or new incident handling procedures that shall be tested, approved, and trained.'
  ],
  references: [
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.3.4.5.10, 4.4.3.4' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 6.1, 8.3, 10, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.26, 5.27' }
  ]
},
{
  id: 'RS.IM-2',
  title: 'Response and Recovery strategies are updated',
  description: 'The organization shall update the response and recovery plans to address changes in its context.',
  cyfunLevel: 'important',
  guidance: [
    'The organization’s context relates to the organizational structure, its critical systems, attack vectors, new threats, improved technology, environment of operation, problems encountered during plan implementation/execution/testing and lessons learned.'
  ],
  references: [
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 6.1, 8.3, 10, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.26, 5.27' }
  ]
}
    ]
  },
  {
    name: 'RECOVER',
    description: 'Recovery planning and processes are improved by incorporating lessons learned into future activities.',
    controls: [
      {
        id: 'RC.RP-1',
        title: 'Recovery plan execution',
        description: 'Recovery plan is executed during or after a cybersecurity incident.',
        cyfunLevel: 'basic',
        guidance: [
          'Roles and Responsibilities, including of who makes the decision to initiate recovery procedures and who will be the contact with appropriate external stakeholders.',
          'What to do with company\'s information and information systems in case of an incident. This includes shutting down or locking computers, moving to a backup site, physically removing important documents, etc.',
          ' Who to call in case of an incident.'
        ],
        references: [
          { name: 'CIS Controls V8', clause: 'Control 11' },
          { name: 'ISO/IEC 27001:2022', clause: 'A.17.1' }
        ]
      },
      {
  id: 'RC.IM-1',
  title: 'Recovery plans incorporate lessons learned',
  description: 'The organization shall incorporate lessons learned from incident recovery activities into updated or new system recovery procedures and, after testing, frame this with appropriate training.',
  cyfunLevel: 'important',
  guidance: [],
  references: [
    { name: 'IEC 62443-2-1:2010', clause: 'Clause 4.4.3.4' },
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 7.5, 8, 10.2, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.27' }
  ]
},
{
  id: 'RC.CO-1',
  title: 'Public relations are managed',
  description: 'The organization shall centralize and coordinate how information is disseminated and manage how the organization is presented to the public.',
  cyfunLevel: 'important',
  guidance: [
    'Public relations management may include, for example, managing media interactions, coordinating, and logging all requests for interviews, handling and triaging phone calls and e-mail requests, matching media requests with appropriate and available internal experts who are ready to be interviewed, screening all of information provided to the media, ensuring personnel are familiar with public relations and privacy policies.'
  ],
  references: [
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 5, 7.4, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.6' }
  ]
},
{
  id: 'RC.CO-3',
  title: 'Recovery activities are communicated to internal and external stakeholders as well as executive and management teams',
  description: 'The organization shall communicate recovery activities to predefined stakeholders, executive and management teams.',
  cyfunLevel: 'important',
  guidance: [
    'Communication of recovery activities to all relevant stakeholders applies only to entities subject to the NIS legislation.'
  ],
  references: [
    { name: 'ISO/IEC 27001:2022', clause: 'Clause 5, 7.4, Annex A' },
    { name: 'ISO/IEC 27002:2022', clause: 'Control 5.6' }
  ]
}
    ]
  }
];