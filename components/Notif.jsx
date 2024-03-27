const Notif = ({ notif, setNotif }) => {

    // Duration = 0 means Do not turn off the Notif (rarely used)
    if (notif?.duration !== 0) { setTimeout(() => { setNotif({ active: false, message: "", success: 0 }); }, notif?.duration || 2000) };

    return (
        <div className="z-50 mt-16 toast toast-top toast-center">
            <div className={`alert alert-info ${(notif?.success === -1) ? "bg-red-500" : (notif?.success === 1) ? "bg-green-500" : "bg-basePrimary"} font-medium text-textPrimary drop-shadow-lg flex items-center justify-center`}>
                <span className=''>{notif?.message}</span>
            </div>
        </div>
    )
}

export default Notif