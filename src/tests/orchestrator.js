import retry from "async-retry";
async function waitForAllServices() {
  await waitForWebServer();
  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      onRetry: (error, attempt) => {
        console.log(
          `Attempt ${attempt} - Failed to fetch Status Page: ${error.message}`,
        );
      },
      minTimeout: 100,
      factor: 1,
      randomize: false,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw new Error(`HTTP error ${response.status}`);
      }
    }
  }
}
const orchestrator = { waitForAllServices };
export default orchestrator;
