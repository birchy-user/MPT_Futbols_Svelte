<script>
    import { onMount } from "svelte";
	import PageTitle from "$components/PageTitle.svelte";
    import Football from "$components/icons/Football.svelte";

    // Ielādētie maču faili:
    /** @type {FileList} */
    let files;

    // Maču dati:
    let matchesJsonData = [];

    // Apstrādā augšupielādētos failus un pārbauda, vai tie ir pareizi JSON faili:
    $: if (files) {
        console.log("Augšupielādētie faili:", files);

        // const uploadedFiles = Array.from(files);

        for (const file of files) {
            // const fileReader = new FileReader();
            const fileContents = file.text();

            fileContents.then((matchData) => {
                matchesJsonData.push(matchData);
            });
        }

        console.log("Matches Data:", matchesJsonData);
    };
</script>

<PageTitle />

<div>
    <div class="z-10 top-0 w-full h-full flex">
        <div class="extraOutline p-4 bg-white w-max bg-whtie m-auto rounded-lg">
            <div class="file_upload p-5 relative border-4 border-dotted border-gray-300 rounded-lg" style="width: 450px">
                <div class="w-max mx-auto mb-4">
                    <Football />
                </div>
                <div class="input_field flex flex-col w-max mx-auto text-center">
                    <label>
                        <input class="text-sm cursor-pointer w-36 hidden" 
                            bind:files
                            multiple
                            type="file"
                        />
                        <div class="text bg-indigo-600 text-white border border-gray-300 rounded font-semibold cursor-pointer p-1 px-3 hover:bg-indigo-500">
                            Augšupielādēt
                        </div>
                    </label>
    
                    <div class="title text-indigo-500">* vai iemest failus šeit</div>
                </div>
            </div>
        </div>
    </div>
</div>