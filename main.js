const btn = document.getElementById("btn");
const address_container = document.getElementById("address-container");
const map_container = document.getElementById("map-container");
const timezone_container = document.getElementById("timezone-container");
const po_container = document.getElementById("po-container");
const container= document.getElementById("container");
const filter= document.getElementById("filter"); 


btn.addEventListener("click", function () {
    navigator.geolocation.getCurrentPosition(
        function (position) {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;

            $.getJSON("https://api.ipify.org?format=json", function (data) {

                // console.log(data.ip);
                let IP = data.ip;
                let url = `https://ipinfo.io/${IP}/json?token=39c49a8c406f1d`;
                fetch(url).then(response => response.json()).then(val => {
                    // console.log(val);
                    // address container update
                    address_container.innerHTML = `<div>
                    <h3>Lat: ${lat}</h3>
                    <h3>Long: ${long}</h3>
                    </div>
                    <div>
                    <h3>City: ${val.city}</h3>
                    <h3>Region: ${val.region}</h3>
                    </div>
                    <div>
                    <h3>Organisation: ${val.org}</h3>
                    <h3>Hostname: ${val.country}</h3>
                    </div>`;

                    //to show the datetime
                    let datetime_str=new Date().toLocaleString("en-US", { timeZone: `${val.timezone}` });
                    fetch(`https://api.postalpincode.in/pincode/${val.postal}`).then(response => response.json()).then(data =>{

                        //time zone container update
                        timezone_container.innerHTML=`<h3>Time Zone: ${val.timezone}</h3>
                        <h3>Time And Date: ${datetime_str}</h3>
                        <h3>Pincode: ${val.postal}</h3>
                        <span><strong>Message:</strong> ${data[0].Message}</span>`;

                        //post-office container
                        data[0].PostOffice.forEach(element => po_container.innerHTML+=`<div class="po-div">
                        <p>Name: ${element.Name}</p>
                        <p>Branch Type: ${element.BranchType}</p>
                        <p>Delivery Status: ${element.DeliveryStatus}</p>
                        <p>District: ${element.District}</p>
                        <p>Division: ${element.Division}</p>
                        </div>`)

                        //filter using name and branch-type
                        filter.addEventListener("keyup", function(){
    
                            let filterValue=this.value.toLowerCase();

                            po_container.innerHTML = '';

                         data[0].PostOffice.forEach(function(element) {
                           if (element.Name.toLowerCase().includes(filterValue) || element.BranchType.toLowerCase().includes(filterValue)) {
                            po_container.innerHTML += `
                                    <div class="po-div">
                                        <p>Name: ${element.Name}</p>
                                        <p>Branch Type: ${element.BranchType}</p>
                                        <p>Delivery Status: ${element.DeliveryStatus}</p>
                                        <p>District: ${element.District}</p>
                                        <p>Division: ${element.Division}</p>
                                    </div>
                                `;
                           }
                         });

                        })
                    })
                    
                })
            })
            
            //to show the map
            map_container.innerHTML=`<iframe src="https://www.google.com/maps?q=${lat},${long}&output=embed" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`;
        })

        //to hide the button and show the container data
        container.style.display="block";
        btn.style.display="none";

})

