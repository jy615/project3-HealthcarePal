import NavigationBar from "./Navbar"
import { Card } from "react-bootstrap"
import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import HeaderFunction from "./Header";
import ToastElement from "../Toast";

export default function UserAppointment () {

    const navigate = useNavigate();
    const location = useLocation();
    const { apptId } = useParams();
    const [apptInfoData, setApptInfoData] = useState({});
    const [userProfileInfo, setuserProfileInfo] = useState({});
    const [toastStatus, setToastStatus] = useState(false);

    useEffect(() => {
        if(location?.state?.msg){
            setToastStatus(true);
        }

        fetch(`/api/apptsummary/${apptId}`)
            .then((response) => response.json())
            .then((data) => {
                if(data.msg === "Not Authorized!"){
                    return navigate("/");
                }
                setApptInfoData(data["userApptHistory"]);
                setuserProfileInfo(data["userProfile"][0]);
            });
    }, [])

    const handleUpdateAppt = () => {
        navigate(`/admin/userApptUpdate/${apptId}`);
    }

    const handleDeleteAppt = () => {
        //DELETE
        fetch(`/api/apptsummary/${apptId}`,     {   method: "DELETE", 
                                                    headers: {
                                                        "Content-type": "application/json" //* vvvvv important, otherwise server receives empty object
                                                    }
                                                })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if(data.msg === "Redirecting to /admin/home"){
                    return navigate(`/admin/home`, {state:{msg: "Appointment info successfully deleted!"}});
                } else {
                    return navigate(`/admin/home`, {state:{msg: "Deleting failed. Please try again later!"}});
                }
            });
    }

    const medLine = `${apptInfoData?.medPrescription?.medicine} | ${apptInfoData?.medPrescription?.dosage} | ${apptInfoData?.medPrescription?.instruction}`;

    const toast = <ToastElement msg={location?.state?.msg} />;

    return (
        <>
        <div className="body">
            <div className="toast-container position-fixed bottom-0 end-0 p-3" style={{zIndex: 11}}>
                {toastStatus ? toast : ""}
            </div>
            <HeaderFunction />
            <div className="d-flex flex-row">
                <NavigationBar userProfileInfo={userProfileInfo} />
                <div className="card m-4 p-5" style={{ width: "65%", height: "fit-content" }}>
                    <h2 className="card-title mb-4">Appointment Overview</h2>
                    <div className="d-flex flex-row justify-content-between mb-3">
                        <Card>
                            <div className="card-body p-4">
                                <h4 className="card-title">Date</h4>
                                <p className="card-text">{apptInfoData?.date?.slice(0,10)}</p>
                            </div>
                        </Card>
                        <Card>
                            <div className="card-body p-4">
                                <h4 className="card-title">Time</h4>
                                <p className="card-text">{apptInfoData?.time} {parseInt(apptInfoData?.time?.slice(0,2)) < 12 ? "AM" : "PM"}</p>
                            </div>
                        </Card>
                        <Card>
                            <div className="card-body p-4">
                                <h4 className="card-title">Appt Type</h4>
                                <p className="card-text">{apptInfoData?.purpose}</p>
                            </div>
                        </Card>
                        <Card>
                            <div className="card-body p-4">
                                <h4 className="card-title">Require Follow-up?</h4>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value="" id="defaultCheck2" checked={apptInfoData?.followUp ? true : false} disabled />
                                </div>
                            </div>
                        </Card>
                        <Card>
                            <div className="card-body p-4">
                                <h4 className="card-title">Billing</h4>
                                <p className="card-text">{apptInfoData?.billingInfo?.toFixed(2)}</p>
                            </div>
                        </Card>
                    </div>

                    <div className="mb-3">
                        <h4>Summary | Diagnosis</h4>
                        <div className="form-group">
                            <textarea className="form-control" id="appt-summary" rows="2" value={apptInfoData?.summary} readOnly></textarea>
                        </div>
                    </div>

                    <div className="mb-3">
                        <h4>Medication</h4>
                        <div className="form-group">
                            <textarea className="form-control" id="appt-medication" rows="2" value={apptInfoData?.medPrescription ? medLine : "NA"} readOnly></textarea>
                        </div>
                    </div>

                    <div className="d-flex flex-row justify-content-around my-4">
                        <button type="button" className="btn btn-primary p-3" onClick={handleUpdateAppt} disabled={apptInfoData?.apptCompleted}>Update Appointment Record</button>
                        <button type="button" className="btn btn-danger p-3" data-bs-toggle="modal" data-bs-target="#exampleModal">Delete Appointment Record</button>
                    </div>

                </div>
            </div>
        </div>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Deleting Appointment Record...</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    Are you sure? This process cannot be undone.
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={handleDeleteAppt} data-bs-dismiss="modal">Delete</button>
                </div>
                </div>
            </div>
        </div>
        </>
    )
}