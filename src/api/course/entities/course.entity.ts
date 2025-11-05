export class CourseEntity {
    id: number;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    seatsAvailable: number;
    instructorId?: number;
  
    constructor(partial: Partial<CourseEntity>) {
      Object.assign(this, partial);
    }
  
    // 🎯 Kursga talaba yozilganda
    enrollStudent() {
      if (this.seatsAvailable <= 0) {
        throw new Error('Kursda bo‘sh o‘rin qolmagan');
      }
      this.seatsAvailable -= 1;
    }
  
    // 🔄 Talaba unenroll bo‘lsa
    unenrollStudent() {
      this.seatsAvailable += 1;
    }
  
    // ⚙️ Capacity o‘zgarganda qayta hisoblash
    updateCapacity(newCapacity: number, currentEnrolledCount: number) {
      if (newCapacity < 0) {
        throw new Error('Capacity musbat son bo‘lishi kerak');
      }
      this.capacity = newCapacity;
      this.seatsAvailable = Math.max(0, newCapacity - currentEnrolledCount);
    }
  
    // 🕒 Kurs holatini aniqlash
    getStatus(): 'upcoming' | 'ongoing' | 'completed' {
      const now = new Date();
      if (now < this.startDate) return 'upcoming';
      if (now > this.endDate) return 'completed';
      return 'ongoing';
    }
  }
  