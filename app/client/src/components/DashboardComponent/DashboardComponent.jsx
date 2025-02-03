import React, { useState, useEffect } from "react";
import { DashboardComponentWrapper } from "./DashboardComponent.styled";
import { configureData } from "../../services/fake-http-dashboard.service";
import {
   RuxTable,
   RuxTableHeader,
   RuxTableHeaderRow,
   RuxTableHeaderCell,
   RuxTableBody,
   RuxCard
} from "@astrouxds/react";
import { statusOptions, severityOptions } from '../../shared';
import DashboardTableFilterComponent from "../DashboardTableFilterComponent/DashboardTableFilterComponent";
import DashboardTableRowComponent from "../DashboardTableRowComponent/DashboardTableRowComponent";
import AlertDetailsModalComponent from "../AlertDetailsModalComponent/AlertDetailsModalComponent";

const DashboardComponent = () => {
   
   // ##### START: Data
   const [data, setData] = useState([])
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // useEffect to fetch data when the component mounts
   useEffect( async () => {
      // Make the API request inside useEffect
      fetch("http://localhost:5000/api/data")
         .then((data) => {
            const rawData = data.json(); // Parse and return JSON response
            console.log('JLL_DEBUG what is the data?????', rawData)
            const sanitized = configureData(rawData);
            setData(sanitized); // Set the fetched data to state
            setLoading(false); // Set loading to false once data is fetched
         })
         .catch((error) => {
            setError(error); // Handle any errors that occur during fetch
            setLoading(false); // Set loading to false even if there was an error
         });
   }, []); // Empty dependency array means this effect runs only once when the component mounts

   const getAlerts = () => {
      // Retrieves alerts based on initial data sorted by timestamp DESC
      return Object.values(data)
        .flat()
        .sort((a, b) => b.contactStartTime - a.contactStartTime);
   }
   const [alerts, setAlerts] = useState(getAlerts());
   // ##### END: Data

   // ##### START: Alert Modal
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedAlert, setSelectedAlert] = useState(null);

   // Function to open the modal and set selected alert data
   const handleOpenModal = (alert) => {
      setSelectedAlert(alert);
      setIsModalOpen(true);
   };

   // Function to close the modal
   const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedAlert(null);
   };

   // Function to acknowledge alert
   const handleAcknowledge = (id) => {
      const newData = { ...data };
      for (const alert of newData[id]) {
         if (alert.id === id) {
            alert.acknowledged = true;
            break;
         }
      }
      setData({...newData, [id]: newData[id]});

      // WORKAROUND: Update current alerts array (preserves existing filtered settings)
      // TODO: Find more performant solution
      const newAlerts = [...alerts];
      for (const alert of newAlerts) {
         if (alert.id === id) {
            alert.acknowledged = true;
            break;
         }
      };
      setAlerts([...newAlerts]);

      handleCloseModal();
   };
   // ##### END: Alert Modal

   // ##### START: Filter
   const handleFilterChange = (filterChange) => {
      const filtered = getAlerts().filter((alert) => {
         let include = true;
         if (filterChange.status) {
            include = filterByStatus(filterChange);
         }
         if (include && filterChange.severity) {
            include = filterBySeverity(filterChange);
         }
         if (include && filterChange.contactName) {
            include = filterbyContactName(filterChange);
         }
         return include;
      })
      setAlerts(filtered);
   }

   const filterByStatus = (change) => (
      change.status === statusOptions.all
      || (change.status === statusOptions.acknowledged && alert.acknowledged)
      || (change.status === statusOptions.unacknowledged && !alert.acknowledged)
   );

   const filterBySeverity = (change) => (
      change.severity === severityOptions.all
      || alert.errorSeverity === change.severity.toLowerCase()
   );

   const filterbyContactName = (change) => (
      change.contactName === ""
      || (change.contactName?.length && alert.contactName.includes(change.contactName))
   );
   // ##### END: Filter

   return (
      <DashboardComponentWrapper data-testid="DashboardComponent">
         <RuxCard>
            <h1>2025 React Astro Dashboard Challenge</h1>
            <DashboardTableFilterComponent
               handleFilterChange={handleFilterChange}/>
         </RuxCard>
         <RuxTable theme="dark">
            <RuxTableHeader>
               <RuxTableHeaderRow>
                  <RuxTableHeaderCell>Status</RuxTableHeaderCell>
                  <RuxTableHeaderCell>Alert Message</RuxTableHeaderCell>
                  <RuxTableHeaderCell>Severity</RuxTableHeaderCell>
                  <RuxTableHeaderCell>Contact Name</RuxTableHeaderCell>
                  <RuxTableHeaderCell>Contact Time</RuxTableHeaderCell>
                  <RuxTableHeaderCell></RuxTableHeaderCell>
               </RuxTableHeaderRow>
            </RuxTableHeader>
            <RuxTableBody>
               {alerts.map((item, index) => (
                  <DashboardTableRowComponent
                     key={index}
                     alert={item}
                     handleOpenModal={handleOpenModal}/>
               ))}
            </RuxTableBody>
         </RuxTable>

         <AlertDetailsModalComponent
            isOpen={isModalOpen}
            alert={selectedAlert}
            handleCloseModal={handleCloseModal}
            handleAcknowledge={handleAcknowledge}/>
      </DashboardComponentWrapper>
   );
};

export default DashboardComponent;
