import axios, { AxiosInstance } from "axios";

export namespace EvolutionApiSdk {
  export interface Options {
    apiKey: string;
    url: string;
    instanceName: string;
  }

  export interface SendMessageOptions {
    number: string;
    text: string;
    delay?: number;
    linkPreview?: boolean;
    mentionsEveryOne?: boolean;
    mentioned?: string[];
    quoted?: {
      key: {
        id: string;
      };
      message: {
        conversation: string;
      };
    };
  }
}

export class EvolutionApiSdk {
  private readonly client: AxiosInstance;

  constructor(private readonly options: EvolutionApiSdk.Options) {
    this.client = axios.create({
      baseURL: this.options.url,
      headers: {
        apikey: this.options.apiKey,
        "Content-Type": "application/json",
      },
    });
  }

  static create(options: EvolutionApiSdk.Options) {
    return new EvolutionApiSdk(options);
  }

  async composing(number: string, delay: number) {
    await this.client.post(
      `/chat/sendPresence/${encodeURIComponent(this.options.instanceName)}`,
      {
        number,
        delay,
        presence: "composing",
      }
    );
  }

  async sendText(options: EvolutionApiSdk.SendMessageOptions) {
    await this.client.post(
      `/message/sendText/${encodeURIComponent(this.options.instanceName)}`,
      options
    );
  }
}
