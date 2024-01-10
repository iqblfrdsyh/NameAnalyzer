const apiGender = "https://api.genderize.io";
const apiCountry = "https://restcountries.com/v3.1/all";
const cina = ["afung", "kokoh", "ci", "afif", "meimei", "ahtong", "sabila"];

const populateCountryDropdown = async () => {
  const countryDropdown = document.getElementById("countryCode");

  try {
    const fetchApi = await fetch(apiCountry);
    let countries = await fetchApi.json();

    countries = countries.sort((a, b) =>
      a.name.common.localeCompare(b.name.common)
    );

    countries.forEach((country) => {
      const option = document.createElement("option");

      if (country.cca2) {
        option.value = country.cca2;
        option.text = country.name.common;
        countryDropdown.appendChild(option);
      }
    });
  } catch (error) {
    console.error("Error fetching country data:", error.message);
  }
};

const predict = async () => {
  let name = document.getElementById("name").value;
  let countryDropdown = document.getElementById("countryCode");
  let selectedOption = countryDropdown.options[countryDropdown.selectedIndex];
  let countryName = selectedOption.text;
  let countryCode = selectedOption.value;
  let resultContainer = document.getElementById("result");

  if (!name.trim().includes(" ")) {
    try {
      if (name == "") {
        alert("Nama tidak boleh kosong");
      } else {
        resultContainer.innerHTML = "Loading...";
        const fetchApi = await fetch(
          `${apiGender}/?name=${name}&country_id=${countryCode}`
        );
        const response = await fetchApi.json();

        console.log(response);

        const gender = response.gender == "male" ? "Pria" : "Wanita";
        const persentase = 100 * response.probability;
        const count = response.count;

        const persentaseWithCheck = cina.some((cinaName) =>
          name.includes(cinaName)
        )
          ? persentase + "% cina"
          : persentase + "%";

        resultContainer.innerHTML = `Nama ${name} di negara ${countryName}, kemungkinan adalah ${
          response.gender == null ? "tidak ada" : gender
        }. <br/><br/> Persentase: ${persentaseWithCheck} <br/> Jumlah: ${count} nama terdaftar`;

        console.log("Country Name:", countryName);
        console.log("Country Code:", countryCode);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      resultContainer.innerHTML = "An error occurred.";
    }
  } else {
    alert("Masukkan hanya satu kata sebagai nama.");
  }
};

populateCountryDropdown();
