function copyLink() {
  const profileUrl = window.location.href; // လက်ရှိ link ကိုယူတာ
  navigator.clipboard.writeText(profileUrl).then(() => {
    const toast = document.getElementById("toast");
    toast.className = "show";
    setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 2000);
  });
}
