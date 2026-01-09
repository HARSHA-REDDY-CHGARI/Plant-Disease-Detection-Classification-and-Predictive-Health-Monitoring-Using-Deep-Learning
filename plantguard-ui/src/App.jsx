// // // // // import React from "react";
// // // // import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// // // // import Result from "./pages/Result.jsx";

// // // // export default function App() {
// // // //   return (
// // // //     <BrowserRouter>
// // // //       <div style={{ padding: 16, borderBottom: "1px solid #eee" }}>
// // // //         <Link to="/result">Result</Link>
// // // //       </div>
// // // //       <Routes>
// // // //         <Route path="/result" element={<Result />} />
// // // //         <Route path="*" element={<div style={{ padding: 24 }}>Open <b>/result</b></div>} />
// // // //       </Routes>
// // // //     </BrowserRouter>
// // // //   );
// // // // }
// // // // src/App.jsx
// // // import React from "react";
// // // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // // import Login from "./pages/Login.jsx";
// // // import Result from "./pages/Result.jsx";

// // // export default function App() {
// // //   return (
// // //     <BrowserRouter>
// // //       <Routes>
// // //         {/* Default route */}
// // //         <Route path="/" element={<Login />} />

// // //         {/* After successful login → navigate to /result */}
// // //         <Route path="/result" element={<Result />} />

// // //         {/* Fallback */}
// // //         <Route path="*" element={<Navigate to="/" replace />} />
// // //       </Routes>
// // //     </BrowserRouter>
// // //   );
// // // }

// // // src/App.jsx
// // import React from "react";
// // import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import Login from "./pages/Login.jsx";
// // import Signup from "./pages/Signup.jsx";
// // import Upload from "./pages/Upload.jsx";
// // import Result from "./pages/Result.jsx";

// // export default function App() {
// //   return (
// //     <BrowserRouter>
// //       <Routes>
// //         <Route path="/" element={<Login />} />
// //         <Route path="/signup" element={<Signup />} />
// //         <Route path="/upload" element={<Upload />} />
// //         <Route path="/result" element={<Result />} />
// //         <Route path="*" element={<Navigate to="/" replace />} />
// //       </Routes>
// //     </BrowserRouter>
// //   );
// // }


// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { auth } from "./services/firebase";
// import Login from "./pages/Login.jsx";
// import Signup from "./pages/Signup.jsx";
// import Upload from "./pages/Upload.jsx";
// import Result from "./Result.jsx";

// function RequireAuth({ children }) {
//   // simple, fast check; for stronger guard you can use onAuthStateChanged
//   const user = auth.currentUser;
//   if (!user) return <Navigate to="/" replace />;
//   return children;
// }

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route
//           path="/upload"
//           element={
//             <RequireAuth>
//               <Upload />
//             </RequireAuth>
//           }
//         />
//         <Route
//           path="/result"
//           element={
//             <RequireAuth>
//               <Result />
//             </RequireAuth>
//           }
//         />
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Upload from "./pages/Upload.jsx";
import Result from "./pages/Result.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/result" element={<Result />} />

        {/* default fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
