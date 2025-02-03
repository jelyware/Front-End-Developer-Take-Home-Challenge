//import { rawData } from './data.js';
//import { readDb, writeDb } from '../../server/database/db-functions';

/*export function fetchData() {
    const rawData = readDb();
    try {
        return rawData.reduce((alerts, item) => {
            if (item.alerts?.length) {
                alerts[item.contactId] = item.alerts.map(alert => ({
                    id: item.contactId,
                    errorMessage: alert.errorMessage,
                    longMessage: alert.longMessage,
                    errorCategory: alert.errorCategory,
                    errorSeverity: alert.errorSeverity,
                    contactName: item.contactName,
                    contactStartTime: item.contactBeginTimestamp,
                    contactEndTime: item.contactEndTimestamp,
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
};

export function updateData(data) {
    try {
        return rawData.reduce((alerts, item) => {
            if (item.alerts?.length) {
                alerts[item.contactId] = item.alerts.map(alert => ({
                    id: item.contactId,
                    errorMessage: alert.errorMessage,
                    longMessage: alert.longMessage,
                    errorCategory: alert.errorCategory,
                    errorSeverity: alert.errorSeverity,
                    contactName: item.contactName,
                    contactStartTime: item.contactBeginTimestamp,
                    contactEndTime: item.contactEndTimestamp,
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
};*/

// TODO get service working
export const fetchData = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/data");

        if (!response.status(201)) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const rawData = await response.json(); // Parse and return JSON response
        console.log()
        return configureData(rawData);
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};

export const updateData = async (data) => {
    try {
    const response = await fetch("http://localhost:5000/api/update", {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.status(201)) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json(); // Parse and return JSON response
    } catch (error) {
    console.error("Error saving data:", error);
    return [];
    }
};

export const configureData = (rawData) => {
    try {
        return rawData.reduce((alerts, item) => {
            if (item.alerts?.length) {
                alerts[item.contactId] = item.alerts.map(alert => ({
                    id: item.contactId,
                    errorMessage: alert.errorMessage,
                    longMessage: alert.longMessage,
                    errorCategory: alert.errorCategory,
                    errorSeverity: alert.errorSeverity,
                    contactName: item.contactName,
                    contactStartTime: item.contactBeginTimestamp,
                    contactEndTime: item.contactEndTimestamp,
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
};
