import RNFS from 'react-native-fs';

export enum DownloadStatus {
  NOT_DOWNLOADED = -1,
  PENDING = 0,
  DOWNLOADING = 1,
  COMPLETED = 2,
  FAILED = 3,
}

class AssetDownloader {
  static #instance: AssetDownloader;
  private downloadJobs: Map<string, number> = new Map();
  private statusListeners: Map<string, ((status: DownloadStatus) => void)[]> =
    new Map();

  private constructor() {}

  public static get instance(): AssetDownloader {
    if (!AssetDownloader.#instance) {
      AssetDownloader.#instance = new AssetDownloader();
    }
    return AssetDownloader.#instance;
  }

  /**
   * Enqueue a file for download
   * @param url URL to download
   * @returns The download ID (jobId)
   */
  public async enqueue(url: string): Promise<number> {
    // Create directory if it doesn't exist
    const dirPath = `${RNFS.DocumentDirectoryPath}/amityDir`;
    const exists = await RNFS.exists(dirPath);

    if (!exists) {
      await RNFS.mkdir(dirPath);
    }

    // Generate a filename from URL hash
    const fileName = `${Math.abs(this.hashCode(url))}.jpg`;
    const filePath = `${dirPath}/${fileName}`;

    // Check if file already exists
    const fileExists = await RNFS.exists(filePath);
    if (fileExists) {
      const dummyId = Date.now();
      this.downloadJobs.set(url, dummyId);
      // Notify as completed
      this.notifyListeners(url, DownloadStatus.COMPLETED);
      return dummyId;
    }

    // Start download
    const jobId = Date.now(); // Use timestamp as unique ID

    try {
      // Begin download
      const downloadOptions = {
        fromUrl: url,
        toFile: filePath,
        background: true,
        discretionary: true,
        begin: () => {
          this.notifyListeners(url, DownloadStatus.DOWNLOADING);
        },
      };

      // Store job ID for tracking
      this.downloadJobs.set(url, jobId);

      // Start download
      const download = RNFS.downloadFile(downloadOptions);

      download.promise
        .then(() => {
          this.notifyListeners(url, DownloadStatus.COMPLETED);
        })
        .catch((error) => {
          console.error('Download file error:', error);
          this.notifyListeners(url, DownloadStatus.FAILED);
        });

      return jobId;
    } catch (error) {
      console.error('Failed to start download:', error);
      this.notifyListeners(url, DownloadStatus.FAILED);
      return -1;
    }
  }

  /**
   * Get the file path for a downloaded asset
   */
  getFilePath(url: string): string {
    const fileName = `${Math.abs(this.hashCode(url))}.jpg`;
    return `${RNFS.DocumentDirectoryPath}/amityDir/${fileName}`;
  }

  /**
   * Check if a file is downloaded
   */
  async isDownloaded(url: string): Promise<boolean> {
    const filePath = this.getFilePath(url);
    return RNFS.exists(filePath);
  }

  /**
   * Get the download status for a job
   */
  public getDownloadStatus(downloadId: number): DownloadStatus {
    // In a real implementation, you'd track the status of each download
    // For now, this is a simplified version
    for (const [_, jobId] of this.downloadJobs.entries()) {
      if (jobId === downloadId) {
        return DownloadStatus.COMPLETED; // Simplified - you'd need to track real status
      }
    }
    return DownloadStatus.NOT_DOWNLOADED;
  }

  /**
   * Add a listener for download status changes
   */
  addStatusListener(url: string, listener: (status: DownloadStatus) => void) {
    if (!this.statusListeners.has(url)) {
      this.statusListeners.set(url, []);
    }
    this.statusListeners.get(url)?.push(listener);
  }

  /**
   * Remove a listener
   */
  removeStatusListener(
    url: string,
    listener: (status: DownloadStatus) => void
  ) {
    const listeners = this.statusListeners.get(url);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Notify all listeners for a URL about a status change
   */
  private notifyListeners(url: string, status: DownloadStatus) {
    const listeners = this.statusListeners.get(url);
    if (listeners) {
      listeners.forEach((listener) => listener(status));
    }
  }

  /**
   * Get a hash code from a string
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * Delete a downloaded file for a specific URL
   * @param url URL of the asset to delete
   * @returns Promise resolving to boolean indicating success
   */
  async deleteFile(url: string): Promise<boolean> {
    try {
      const filePath = this.getFilePath(url);
      const exists = await RNFS.exists(filePath);

      if (exists) {
        await RNFS.unlink(filePath);

        // Update tracking
        const jobId = this.downloadJobs.get(url);
        if (jobId) {
          this.downloadJobs.delete(url);
          this.notifyListeners(url, DownloadStatus.NOT_DOWNLOADED);
        }

        return true;
      } else {
        console.error(`File does not exist: ${filePath}`);
        return false;
      }
    } catch (error) {
      console.error(`Error deleting file for URL ${url}:`, error);
      return false;
    }
  }

  /**
   * Delete all downloaded files
   * @returns Promise resolving to boolean indicating success
   */
  async deleteAllFiles(): Promise<boolean> {
    try {
      const dirPath = `${RNFS.DocumentDirectoryPath}/amityDir`;
      const exists = await RNFS.exists(dirPath);

      if (exists) {
        // Read directory and get all files
        const files = await RNFS.readDir(dirPath);

        // Delete all files
        await Promise.all(files.map((file) => RNFS.unlink(file.path)));

        // Reset tracking
        for (const [url] of this.downloadJobs) {
          this.notifyListeners(url, DownloadStatus.NOT_DOWNLOADED);
        }
        this.downloadJobs.clear();

        return true;
      } else {
        return true; // Still consider this a success since end result is no files
      }
    } catch (error) {
      console.error('Error deleting asset files:', error);
      return false;
    }
  }
}

export default AssetDownloader;
