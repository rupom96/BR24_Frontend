/* eslint-disable import/prefer-default-export */
export function checkArrayContents(
  extendedBiznessEventName: string[] | undefined,
  biznessEventName: string | undefined
): string {
  // const sortedArray = array.sort();
  const arrayKey = extendedBiznessEventName
    ? extendedBiznessEventName.join(',')
    : '';
  const biznessEventNameProcessed = biznessEventName
    ? biznessEventName.replace(/([A-Z])/g, ' $1')
    : '';
  switch (arrayKey) {
    case 'ProcurementTenderDetail':
      return 'Tender Product';
    case 'ProcurementTenderAdditionalCost':
      return 'Tender Additional';
    case 'ProcurementTenderDetail,ProcurementTenderAdditionalCost':
      return 'Tender Product Additional';
    case 'ProcurementTenderAdditionalCost,ProcurementTenderDetail':
      return 'Tender Product Additional';
    // Add more cases as needed
    default:
      return biznessEventNameProcessed;
  }
}
