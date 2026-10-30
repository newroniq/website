function showView(viewId) {
        const targetView = document.getElementById("view-" + viewId);

        if (targetView) {
            document
                .querySelectorAll(".view-section")
                .forEach((s) => s.classList.remove("active"));
            targetView.classList.add("active");
            window.scrollTo(0, 0);
        } else {
            console.error(`View "view-${viewId}" not found in document.`);
        }
    }

    const paperData = window.paperData;
    const pageCopy = window.pageCopy;

    document.getElementById("contact-form").addEventListener("submit", (event) => {
        event.preventDefault();

        const message = document.createElement("div");
        message.className = "text-center py-12";

        const heading = document.createElement("h4");
        heading.className = "text-2xl font-bold text-nq-red mb-2";
        heading.textContent = pageCopy.message_sent;

        const description = document.createElement("p");
        description.className = "text-gray-500";
        description.textContent = pageCopy.an_outcome_specialist_will_contact_you;

        message.append(heading, description);
        document.getElementById("contact-form-container").replaceChildren(message);
    });

    function openPaper(paperId) {
        const area = document.getElementById("paper-content-area");
        const data = paperData[paperId];

        if (data && area) {
            area.innerHTML = data.content;
            showView("paper-content");
        } else {
            console.error("Paper content not found for ID:", paperId);
        }
    }
