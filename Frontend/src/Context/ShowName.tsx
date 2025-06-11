export function ShowName() {
  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null; // ✅ Parse JSON

  //console.log(user?.username); // ✅ Safe access

  return (
    <div className="text-2xl font-bold">
      {user?.username ? user.username.charAt(0).toUpperCase() : "?"}
    </div>
  );
}
