/*************************************************************************************
 * Create views for progress (from learns_sign table)
 *************************************************************************************/

BEGIN;

/* Cleanup */
DROP VIEW IF EXISTS get_progress CASCADE;

/* Views */
-- returns the regular learns_sign table
CREATE VIEW get_progress ("user_id", "sign_id", "exercise_id", "progress", "intro_done", "level_3_reached")
AS
SELECT "user_id", "sign_id", "exercise_id", "progress", "intro_done", "level_3_reached"
FROM   "learns_sign"
;

COMMIT;
