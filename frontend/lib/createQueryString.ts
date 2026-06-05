export type SearchParams = {
  page?: string;
  type?: string;
  keyword?: string;
  sort?: string;
};

export const createQueryString = (searchParams: SearchParams) => {
  const params = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    }
  });
  return params.toString();
};
