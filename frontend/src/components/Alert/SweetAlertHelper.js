import React, { useState } from "react";
import Swal from "sweetalert2";
import styles from "./SweetAlertHelper.module.css";

const SweetAlertHelper = () => {
  const [alertStatus, setAlertStatus] = useState(false);

  async function alertPopUp(alertMsg) {
    try {
      const result = await Swal.fire({
        text: alertMsg,
        showCancelButton: false,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        setAlertStatus(true);
      } else {
        setAlertStatus(false);
      }

      return result.isConfirmed;
    } catch (error) {
      console.error("Error in alertPopUp:", error);
      return false;
    }
  }

  async function confirmPopUp(title, text) {
    try {
      const result = await Swal.fire({
        title,
        text,
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        customClass: {
          popup: styles.sweetalert_small_font, // Correctly use the generated class name
        },
      });

      const confirmed = result.isConfirmed;
      setAlertStatus(confirmed);
      return confirmed;
    } catch (error) {
      console.error("Error in confirmPopUp:", error);
      return false;
    }
  }

  async function confirmPopUpwithYesOrNo(title, text) {
    try {
      const result = await Swal.fire({
        title,
        text,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      });

      const confirmed = result.isConfirmed;
      setAlertStatus(confirmed);
      return confirmed;
    } catch (error) {
      console.error("Error in confirmPopUpwithYesOrNo:", error);
      return false;
    }
  }

  return {
    alertPopUp,
    confirmPopUp,
    confirmPopUpwithYesOrNo,
  };
};

export default SweetAlertHelper;
