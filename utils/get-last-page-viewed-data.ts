export const returnLastPageViewedData = () => {
  const lastViewedPageData = JSON.parse(localStorage.getItem('lastViewedPage') || '{}');
  return lastViewedPageData;
};

export const setRecentPageData = (pageType: string, pageID: string) => {
  localStorage.setItem('lastViewedPage', JSON.stringify({ reference_type: pageType, reference_id: pageID }));
};
