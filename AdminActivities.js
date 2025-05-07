import React from 'react';
import './Admin_activities.css';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';

function App() {
    return (
        <div className="admin-activities-wrapper">
            <div className="admin-activities">
                <h1>Admin Activities</h1>
                <nav className="button-nav">
                    <div className="add-services">
                        <Link to="/AdminContactUs" name="AdminContactUs">
                            <button>Suggestions</button>
                        </Link>
                        <Link to="/addPublicToilets" name="adminaddPublicToilets" state={{ service: 'addPublicToilets' }}>
                            <button>Add Public Toilets</button>
                        </Link>
                        <Link to="/removePublicToilets" name="adminRemovePublicToilets" state={{ service: 'removePublicToilets' }}>
                            <button>Remove Public Toilets</button>
                        </Link>
                    </div>

                    <div className="remove-services">

                    </div>
                </nav>
            </div>
        </div>
    );
}

export default App;


// import React from 'react';
// import './Admin_activities.css';
// import { Link } from 'react-router-dom';
// import Navbar from '../Navbar/Navbar';
// import Footer from '../Footer/Footer';

// function App() {
//     return (
//         <div className="admin-activities-wrapper">
//             <Navbar />
//             <div className="admin-activities">
//                 <h1>Admin Activities</h1>
//                 <nav className="button-nav">
//                     <div className="add-services">
//                         <Link to="/admin/Add_remove_hotels" name="adminAddHotel" state={{ service: 'addHotel' }}>
//                             <button>Add hotels</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_restaurants" name="adminAddRest" state={{ service: 'addRestaurant' }}>
//                             <button>Add restaurants</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_localBuses" name="adminAddLocalBus" state={{ service: 'addLocalBus' }}>
//                             <button>Add localBuses</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_StateBuses" name="adminAddStateBus" state={{ service: 'addStateBus' }}>
//                             <button>Add StateBuses</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_rickshaw" name="adminAddRickshaw" state={{ service: 'addRickshaw' }}>
//                             <button>Add Rickshaw</button>
//                         </Link>
//                         <Link to="/admin/Remove_feedback" name="adminRemoveFeedback" state={{ service: 'removeFeedback' }}>
//                             <button>Remove Feedback</button>
//                         </Link>
//                     </div>

//                     <div className="remove-services">
//                         <Link to="/admin/Add_remove_hotels" name="adminRemoveHotel" state={{ service: 'removeHotel' }}>
//                             <button>Remove hotels</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_restaurants" name="adminRemoveRest" state={{ service: 'removeRestaurant' }}>
//                             <button>Remove restaurants</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_localBuses" name="adminRemoveLocalBus" state={{ service: 'removeLocalBus' }}>
//                             <button>Remove localBuses</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_StateBuses" name="adminRemoveStateBus" state={{ service: 'removeStateBus' }}>
//                             <button>Remove StateBuses</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_rickshaw" name="adminRemoveRickshaw" state={{ service: 'removeRickshaw' }}>
//                             <button>Remove Rickshaw</button>
//                         </Link>
//                         <Link to="/admin/Remove_reply" name="adminRemoveReply" state={{ service: 'removeReply' }}>
//                             <button>Remove Reply</button>
//                         </Link>
//                     </div>
//                 </nav>
//             </div>
//             <Footer />
//         </div>
//     );
// }

// export default App;


// import React from 'react';
// import './Admin_activities.css';
// import { Link } from 'react-router-dom';
// import Navbar from '../Navbar/Navbar';

// function App() {
//     return (
//         <div className="admin-activities-wrapper">
//             <div className="admin-activities">
//                 <h1>Admin Activities</h1>
//                 <nav className="button-nav">
//                     <div className="add-services">
//                         <Link to="/AdminContactUs" name="AdminContactUs">
//                             <button>Suggestions</button>
//                         </Link>
//                         <Link to="/addPublicToilets" name="adminaddPublicToilets" state={{ service: 'addPublicToilets' }}>
//                             <button>Add Public Toilets</button>
//                         </Link>
//                         {/* <Link to="/admin/Add_remove_restaurants" name="adminAddRest" state={{ service: 'addRestaurant' }}>
//                             <button>Add restaurants</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_localBuses" name="adminAddLocalBus" state={{ service: 'addLocalBus' }}>
//                             <button>Add localBuses</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_StateBuses" name="adminAddStateBus" state={{ service: 'addStateBus' }}>
//                             <button>Add StateBuses</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_rickshaw" name="adminAddRickshaw" state={{ service: 'addRickshaw' }}>
//                             <button>Add Rickshaw</button>
//                         </Link>
//                         <Link to="/admin/Remove_feedback" name="adminRemoveFeedback" state={{ service: 'removeFeedback' }}>
//                             <button>Remove Feedback</button>
//                         </Link> */}
//                     </div>

//                     <div className="remove-services">
//                         <Link to="/removePublicToilets" name="adminRemovePublicToilets" state={{ service: 'removePublicToilets' }}>
//                             <button>Remove Public Toilets</button>
//                         </Link>
//                         {/* <Link to="/admin/Add_remove_restaurants" name="adminRemoveRest" state={{ service: 'removeRestaurant' }}>
//                             <button>Remove restaurants</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_localBuses" name="adminRemoveLocalBus" state={{ service: 'removeLocalBus' }}>
//                             <button>Remove localBuses</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_StateBuses" name="adminRemoveStateBus" state={{ service: 'removeStateBus' }}>
//                             <button>Remove StateBuses</button>
//                         </Link>
//                         <Link to="/admin/Add_remove_rickshaw" name="adminRemoveRickshaw" state={{ service: 'removeRickshaw' }}>
//                             <button>Remove Rickshaw</button>
//                         </Link>
//                         <Link to="/admin/Remove_reply" name="adminRemoveReply" state={{ service: 'removeReply' }}>
//                             <button>Remove Reply</button>
//                         </Link> */}
//                     </div>
//                 </nav>
//             </div>
//         </div>
//     );
// }

// export default App;


// // import React from 'react';
// // import './Admin_activities.css';
// // import { Link } from 'react-router-dom';
// // import Navbar from '../Navbar/Navbar';
// // import Footer from '../Footer/Footer';

// // function App() {
// //     return (
// //         <div className="admin-activities-wrapper">
// //             <Navbar />
// //             <div className="admin-activities">
// //                 <h1>Admin Activities</h1>
// //                 <nav className="button-nav">
// //                     <div className="add-services">
// //                         <Link to="/admin/Add_remove_hotels" name="adminAddHotel" state={{ service: 'addHotel' }}>
// //                             <button>Add hotels</button>
// //                         </Link>
// //                         <Link to="/admin/Add_remove_restaurants" name="adminAddRest" state={{ service: 'addRestaurant' }}>
// //                             <button>Add restaurants</button>
// //                         </Link>
// //                         <Link to="/admin/Add_remove_localBuses" name="adminAddLocalBus" state={{ service: 'addLocalBus' }}>
// //                             <button>Add localBuses</button>
// //                         </Link>
// //                         <Link to="/admin/Add_remove_StateBuses" name="adminAddStateBus" state={{ service: 'addStateBus' }}>
// //                             <button>Add StateBuses</button>
// //                         </Link>
// //                         <Link to="/admin/Add_remove_rickshaw" name="adminAddRickshaw" state={{ service: 'addRickshaw' }}>
// //                             <button>Add Rickshaw</button>
// //                         </Link>
// //                         <Link to="/admin/Remove_feedback" name="adminRemoveFeedback" state={{ service: 'removeFeedback' }}>
// //                             <button>Remove Feedback</button>
// //                         </Link>
// //                     </div>

// //                     <div className="remove-services">
// //                         <Link to="/admin/Add_remove_hotels" name="adminRemoveHotel" state={{ service: 'removeHotel' }}>
// //                             <button>Remove hotels</button>
// //                         </Link>
// //                         <Link to="/admin/Add_remove_restaurants" name="adminRemoveRest" state={{ service: 'removeRestaurant' }}>
// //                             <button>Remove restaurants</button>
// //                         </Link>
// //                         <Link to="/admin/Add_remove_localBuses" name="adminRemoveLocalBus" state={{ service: 'removeLocalBus' }}>
// //                             <button>Remove localBuses</button>
// //                         </Link>
// //                         <Link to="/admin/Add_remove_StateBuses" name="adminRemoveStateBus" state={{ service: 'removeStateBus' }}>
// //                             <button>Remove StateBuses</button>
// //                         </Link>
// //                         <Link to="/admin/Add_remove_rickshaw" name="adminRemoveRickshaw" state={{ service: 'removeRickshaw' }}>
// //                             <button>Remove Rickshaw</button>
// //                         </Link>
// //                         <Link to="/admin/Remove_reply" name="adminRemoveReply" state={{ service: 'removeReply' }}>
// //                             <button>Remove Reply</button>
// //                         </Link>
// //                     </div>
// //                 </nav>
// //             </div>
// //             <Footer />
// //         </div>
// //     );
// // }

// // export default App;
