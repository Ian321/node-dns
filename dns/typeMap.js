module.exports = {
  QTYPE: {
    // Resource records
    1: 'A',
    2: 'NS',
    5: 'CNAME',
    6: 'SOA',
    11: 'WKS',
    12: 'PTR',
    13: 'HINFO',
    14: 'MINFO',
    15: 'MX',
    16: 'TXT',
    17: 'RP',
    18: 'AFSDB',
    24: 'SIG',
    25: 'KEY',
    28: 'AAAA',
    29: 'LOC',
    33: 'SRV',
    35: 'NAPTR',
    36: 'KX',
    37: 'CERT',
    39: 'DNAME',
    42: 'APL',
    43: 'DS',
    44: 'SSHFP',
    45: 'IPSECKEY',
    46: 'RRSIG',
    47: 'NSEC',
    48: 'DNSKEY',
    49: 'DHCID',
    50: 'NSEC3',
    51: 'NSEC3PARAM',
    52: 'TLSA',
    55: 'HIP',
    59: 'CDS',
    60: 'CDNSKEY',
    61: 'OPENPGPKEY',
    249: 'TKEY',
    250: 'TSIG',
    256: 'URI',
    257: 'CAA',
    32768: 'TA',
    32769: 'DLV',
    // Other types and pseudo resource records
    41: 'OPT',
    251: 'IXFR',
    252: 'AXFR',
    255: '*'
  },
  QCLASS: {
    1: 'IN',
    2: 'CS',
    3: 'CH',
    4: 'HS'
  },
  /**
   * https://en.wikipedia.org/wiki/List_of_IP_protocol_numbers
   * For more look at [1]
   */
  IP: {
    0: 'HOPOPT',
    1: 'ICMP',
    2: 'IGMP',
    3: 'GGP',
    4: 'IP-in-IP',
    5: 'ST',
    6: 'TCP',
    7: 'CBT',
    8: 'EGP',
    9: 'IGP',
    10: 'BBN-RCC-MON',
    11: 'NVP-II',
    12: 'PUP',
    13: 'ARGUS',
    14: 'EMCON',
    15: 'XNET',
    16: 'CHAOS',
    17: 'UDP',
    18: 'MUX',
    19: 'DCN-MEAS',
    20: 'HMP',
    21: 'PRM',
    22: 'XNS-IDP',
    23: 'TRUNK-1',
    24: 'TRUNK-2',
    25: 'LEAF-1',
    26: 'LEAF-2',
    27: 'RDP',
    28: 'IRTP',
    29: 'ISO-TP4',
    30: 'NETBLT',
    31: 'MFE-NSP',
    32: 'MERIT-INP',
    33: 'DCCP',
    34: '3PC',
    35: 'IDPR',
    36: 'XTP',
    37: 'DDP',
    38: 'IDPR-CMTP',
    39: 'TP++',
    40: 'IL',
    41: 'IPv6',
    42: 'SDRP',
    43: 'IPv6-Route',
    44: 'IPv6-Frag',
    45: 'IDRP',
    46: 'RSVP',
    47: 'GREs',
    48: 'DSR',
    49: 'BNA',
    50: 'ESP',
    51: 'AH',
    52: 'I-NLSP',
    53: 'SWIPE',
    54: 'NARP',
    55: 'MOBILE',
    56: 'TLSP',
    57: 'SKIP',
    58: 'IPv6-ICMP',
    59: 'IPv6-NoNxt',
    60: 'IPv6-Opts',
    61: 'Any host internal protocol',
    62: 'CFTP',
    63: 'Any local network',
    64: 'SAT-EXPAK',
    65: 'KRYPTOLAN',
    66: 'RVD',
    67: 'IPPC',
    68: 'Any distributed file system',
    69: 'SAT-MON',
    70: 'VISA',
    71: 'IPCU',
    72: 'CPNX',
    73: 'CPHB',
    74: 'WSN',
    75: 'PVP',
    76: 'BR-SAT-MON',
    77: 'SUN-ND',
    78: 'WB-MON',
    79: 'WB-EXPAK',
    80: 'ISO-IP',
    81: 'VMTP',
    82: 'SECURE-VMTP',
    83: 'VINES',
    84: 'TTP <or> IPTM',
    85: 'NSFNET-IGP',
    86: 'DGP',
    87: 'TCF',
    88: 'EIGRP',
    89: 'OSPF',
    90: 'Sprite-RPC',
    91: 'LARP',
    92: 'MTP',
    93: 'AX.25',
    94: 'OS',
    95: 'MICP',
    96: 'SCC-SP',
    97: 'ETHERIP',
    98: 'ENCAP',
    99: 'Any private encryption scheme',
    100: 'GMTP',
    101: 'IFMP',
    102: 'PNNI',
    103: 'PIM',
    104: 'ARIS',
    105: 'SCPS',
    106: 'QNX',
    107: 'A/N',
    108: 'IPComp',
    109: 'SNP',
    110: 'Compaq-Peer',
    111: 'IPX-in-IP',
    112: 'VRRP',
    113: 'PGM',
    114: 'Any 0-hop protocol',
    115: 'L2TP',
    116: 'DDX',
    117: 'IATP',
    118: 'STP',
    119: 'SRP',
    120: 'UTI',
    121: 'SMP',
    122: 'SM',
    123: 'PTP',
    124: 'IS-IS over IPv4',
    125: 'FIRE',
    126: 'CRTP',
    127: 'CRUDP',
    128: 'SSCOPMCE',
    129: 'IPLT',
    130: 'SPS',
    131: 'PIPE',
    132: 'SCTP',
    133: 'FC',
    134: 'RSVP-E2E-IGNORE',
    135: 'Mobility Header',
    136: 'UDPLite',
    137: 'MPLS-in-IP',
    138: 'manet',
    139: 'HIP',
    140: 'Shim6',
    141: 'WESP',
    142: 'ROHC'
  }
};
/* Hi, this is [1]
  (() => {
    let y = '';
    $('table tr').each(function () {
      const x = $(this).find('td');
      if (x[2]) {
        y += `${x[1].innerHTML}: '${(x[2].innerHTML === '' ? x[3].innerHTML : x[2].innerHTML).replace(/<a .*>(.*)<\/a>/, '$1')}',`;
      }
    });
    console.log(y);
  })();
*/
