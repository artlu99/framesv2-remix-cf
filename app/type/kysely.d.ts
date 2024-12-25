export interface Database {
  about: {
    version: string;
  };
  links: {
    id: number;
    order: number;
    fid: number;
    label: string;
    url: string;
    created_at: string;
  };
  wallets: {
    id: number;
    order: number;
    fid: number;
    label: string;
    address: string;
    tooltip: string;
    created_at: string;
  };
}
