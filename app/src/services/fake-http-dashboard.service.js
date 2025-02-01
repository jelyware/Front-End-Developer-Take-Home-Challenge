import { rawData } from './data.js';

export function fetchData() {
    try {
        return rawData.reduce((alerts, item) => {
            if (item.alerts?.length) {
                //console.log('JLL_DEBUG what is alerts[item.contactId]????', alerts[item.contactId])
                alerts[item.contactId] = item.alerts.map(alert => ({
                    id: item.contactId,
                    errorMessage: alert.errorMessage,
                    longMessage: alert.longMessage,
                    errorCategory: alert.errorCategory,
                    errorSeverity: alert.errorSeverity,
                    contactName: item.contactName,
                    contactTime: item.contactBeginTimestamp - item.contactEndTimestamp,
                    contactSatellite: item.contactSatellite,
                    contactDetail: item.contactDetail,
                    acknowledged: false, // Stub value to false in absence of internal db
                }));
            }

            return alerts;
        }, {});
    } catch (error) {
        console.error('Error fetching data:', error);
        return {};
    }
}
