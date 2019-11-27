//Static library for phaser usage

export default class PhaserLib {
	public static toDegree(rad) {
		return (rad * 180) / Math.PI;
	}

	public static findNewPoint(
		location: Phaser.Math.Vector2,
		angle: number,
		distance: any,
	): Phaser.Math.Vector2 {
		var result: Phaser.Math.Vector2 = new Phaser.Math.Vector2();

		result.x = Math.round(
			Math.cos((angle * Math.PI) / 180) * distance + location.x,
		);
		result.y = Math.round(
			Math.sin((angle * Math.PI) / 180) * distance + location.y,
		);

		return result;
	}

	public static spreadChange(angle: number, spreadCone: number): number {
		var result =
			Math.pow(Math.random() * spreadCone - spreadCone / 2, 3) /
			Math.pow(spreadCone / 2, 2);
		result += angle;
		return result;
	}

	static Random = class {
		static N = 624;
		static M = 397;
		static MATRIX_A = 0x9908b0df;
		/* constant vector a */
		static UPPER_MASK = 0x80000000;
		/* most significant w-r bits */
		static LOWER_MASK = 0x7fffffff;
		/* least significant r bits */

		mt = new Array(PhaserLib.Random.N);
		/* the array for the state vector */
		mti = PhaserLib.Random.N + 1;
		/* mti==N+1 means mt[N] is not initialized */

		constructor(seed: number = null) {
			if (seed == null) {
				seed = new Date().getTime();
			}

			this.init_genrand(seed);
		}

		private init_genrand(s: number) {
			this.mt[0] = s >>> 0;
			for (this.mti = 1; this.mti < PhaserLib.Random.N; this.mti++) {
				var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
				this.mt[this.mti] =
					((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
					(s & 0x0000ffff) * 1812433253 +
					this.mti;
				/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
				/* In the previous versions, MSBs of the seed affect   */
				/* only MSBs of the array mt[].                        */
				/* 2002/01/09 modified by Makoto Matsumoto             */
				this.mt[this.mti] >>>= 0;
				/* for >32 bit machines */
			}
		}

		/**
		 * generates a random number on [0,0xffffffff]-interval
		 * @private
		 */
		private _nextInt32(): number {
			var y: number;
			var mag01 = new Array(0x0, PhaserLib.Random.MATRIX_A);
			/* mag01[x] = x * MATRIX_A  for x=0,1 */

			if (this.mti >= PhaserLib.Random.N) {
				/* generate N words at one time */
				var kk: number;

				if (this.mti == PhaserLib.Random.N + 1)
					/* if init_genrand() has not been called, */
					this.init_genrand(5489);
				/* a default initial seed is used */

				for (kk = 0; kk < PhaserLib.Random.N - PhaserLib.Random.M; kk++) {
					y =
						(this.mt[kk] & PhaserLib.Random.UPPER_MASK) |
						(this.mt[kk + 1] & PhaserLib.Random.LOWER_MASK);
					this.mt[kk] =
						this.mt[kk + PhaserLib.Random.M] ^ (y >>> 1) ^ mag01[y & 0x1];
				}
				for (; kk < PhaserLib.Random.N - 1; kk++) {
					y =
						(this.mt[kk] & PhaserLib.Random.UPPER_MASK) |
						(this.mt[kk + 1] & PhaserLib.Random.LOWER_MASK);
					this.mt[kk] =
						this.mt[kk + (PhaserLib.Random.M - PhaserLib.Random.N)] ^
						(y >>> 1) ^
						mag01[y & 0x1];
				}
				y =
					(this.mt[PhaserLib.Random.N - 1] & PhaserLib.Random.UPPER_MASK) |
					(this.mt[0] & PhaserLib.Random.LOWER_MASK);
				this.mt[PhaserLib.Random.N - 1] =
					this.mt[PhaserLib.Random.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

				this.mti = 0;
			}

			y = this.mt[this.mti++];

			/* Tempering */
			y ^= y >>> 11;
			y ^= (y << 7) & 0x9d2c5680;
			y ^= (y << 15) & 0xefc60000;
			y ^= y >>> 18;

			return y >>> 0;
		}

		/**
		 * generates an int32 pseudo random number
		 * @param range: an optional [from, to] range, if not specified the result will be in range [0,0xffffffff]
		 * @return {number}
		 */
		nextInt32(range: [number, number] = null): number {
			var result = this._nextInt32();
			if (range == null) {
				return result;
			}

			return (result % (range[1] - range[0])) + range[0];
		}

		/**
		 * generates a random number on [0,0x7fffffff]-interval
		 */
		nextInt31(): number {
			return this._nextInt32() >>> 1;
		}

		/**
		 * generates a random number on [0,1]-real-interval
		 */
		nextNumber(): number {
			return this._nextInt32() * (1.0 / 4294967295.0);
		}

		/**
		 * generates a random number on [0,1) with 53-bit resolution
		 */
		nextNumber53(): number {
			var a = this._nextInt32() >>> 5,
				b = this._nextInt32() >>> 6;
			return (a * 67108864.0 + b) * (1.0 / 9007199254740992.0);
		}
	};
}
